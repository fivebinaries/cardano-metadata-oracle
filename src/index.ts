import * as chalk from 'chalk';
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
import { CLIError } from '@oclif/errors';
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { composeMetadata } from './transaction/composeMetadata';
import { fetchDataSources } from './remote-data/fetchData';
import { parseFile } from './remote-data/parseOriginFile';
import { BlockfrostClient } from './services/blockfrost';
import {
    CardanoNodeClient,
    convertToCliTx,
    convertToCliTxDraft,
} from './services/cardano-node';
import { composeTransaction } from './transaction/composeTransaction';
import { signTransaction } from './transaction/signTransaction';
import { deriveAddressPrvKey, parseDerivationPath } from './utils/key';
import { mnemonicFromFile, mnemonicToPrivateKey } from './utils/mnemonic';
import { writeToFile } from './utils/file';
import { getExplorerLink } from './utils/explorer';
import { renderMetadata, renderTransactionTable } from './utils/cli';
import { UTXO } from './types';
import { Metrics } from './utils/metrics';
import { getRemainingBalance } from './utils/transaction';
import { ERROR } from './constants/messages';

class CardanoMetadataOracle extends Command {
    static flags = {
        version: flags.version({ char: 'v' }),
        help: flags.help({ char: 'h' }),
        'origin-file': flags.string({
            description:
                'Path to the origin file which contains the list of origins',
            required: true,
        }),
        address: flags.string({
            description: 'Address to build the transaction',
            required: false,
            exclusive: ['seed-file'],
        }),
        network: flags.string({
            description:
                'Specify the Cardano network (Optional, mainnet by default)',
            options: ['mainnet', 'testnet'],
            default: 'mainnet',
            required: false,
        }),
        'metadata-label': flags.integer({
            description:
                'Integer of the Cardano metadata label as per CIP10 (Optional, default 1968)',
            required: false,
            default: 1968,
        }),
        'out-file': flags.string({
            description: 'Writes transaction to a file',
        }),
        'address-derivation-path': flags.string({
            description:
                "Derivation path for the address in 'account/chain/address' format",
            default: '0/0/0',
            required: false,
        }),
        'seed-file': flags.string({
            description: 'File containing the ED25519-BIP32 seed phrase',
            required: false,
            exclusive: ['address'],
        }),
        backend: flags.string({
            description:
                'Backend to facilitate communication with the Cardano blockchain',
            required: false,
            default: 'blockfrost',
            options: ['blockfrost', 'cardano-node'],
        }),
        'prometheus-exporter-file': flags.string({
            description: 'File to export prometheus metrics',
            required: false,
        }),
    };

    async run(): Promise<void> {
        const metrics = new Metrics();
        let address = '';
        let signKey: CardanoWasm.PrivateKey | undefined;
        const { flags } = this.parse(CardanoMetadataOracle);
        const blockfrostApiKey = process.env['BLOCKFROST_PROJECT_ID'] ?? '';
        const testnet = flags.network === 'testnet';

        if (!flags.address && !flags['seed-file']) {
            throw Error(ERROR.FLAG_MISSING_SEED_OR_ADDR);
        }

        if (flags.backend === 'blockfrost' && !blockfrostApiKey) {
            // Make sure API key is set in order to use Blockfrost API
            throw Error(ERROR.ENV_BLOCKFROST_PROJECT_ID_NOT_SET);
        }

        if (flags['seed-file']) {
            // console.log("Generating address, signing key from seed file");
            const mnemonic = mnemonicFromFile(flags['seed-file']);
            const prvKey = mnemonicToPrivateKey(mnemonic);
            const derivationPath = parseDerivationPath(
                flags['address-derivation-path'],
            );
            const derivation = deriveAddressPrvKey(
                prvKey,
                derivationPath,
                testnet,
            );

            address = derivation.address;
            signKey = derivation.signKey;
            console.log(`Generated address ${address}`);
        } else if (flags.address) {
            address = flags.address;
        }

        const dataSources = parseFile(flags['origin-file']);

        if (!dataSources) {
            throw Error(ERROR.ORIGIN_FILE_NO_DATA);
        }

        // Fetch metadata from remote endpoints
        cli.action.start('Fetching data from sources in origin file');
        // console.log("Fetching data from sources in origin file");
        const fetchedData = await fetchDataSources(dataSources);
        if (!fetchedData) {
            throw Error(ERROR.REMOTE_DATA_NO_DATA);
        }
        cli.action.stop();

        renderMetadata(fetchedData);

        // Compose metadata
        const composedMetadata = composeMetadata(
            fetchedData,
            flags['metadata-label'],
        );

        // Fetch utxos
        const client =
            flags.backend === 'blockfrost'
                ? new BlockfrostClient(testnet, blockfrostApiKey)
                : new CardanoNodeClient(testnet);
        let utxos: UTXO[] = [];
        cli.action.start('Fetching UTXOs');
        const fetchedUtxos = await client.fetchUtxos(address);
        cli.action.stop();
        if (fetchedUtxos.length > 0) {
            utxos = fetchedUtxos;
        } else {
            throw Error(ERROR.UTXOS_EMPTY);
        }

        // cli.action.start("Building transaction");
        const { txId, txBody, txMetadata, info } = composeTransaction(
            address,
            composedMetadata,
            utxos,
        );

        renderTransactionTable(
            txId,
            info.totalFeesAmount.to_str(),
            info.usedUtxos,
        );

        if (signKey) {
            // set prvKey for signing if seed-file was provided

            // console.log("Signing transaction");
            const transaction = signTransaction(txBody, txMetadata, signKey);

            // Write transaction to a file
            if (flags['out-file']) {
                writeToFile(
                    flags['out-file'],
                    JSON.stringify(
                        convertToCliTx(transaction.to_bytes()),
                        null,
                        4,
                    ),
                );
            }

            // Push transaction to network
            const res = await client.pushTransaction(transaction.to_bytes());
            if (res) {
                console.log();
                console.log(
                    chalk.green(
                        `Transaction successfully submitted: ${getExplorerLink(
                            txId,
                            testnet,
                        )}`,
                    ),
                );
            }
        } else {
            console.log(
                chalk.blueBright(
                    'Provide a signing key (--sign-key) to push the transaction to the network or --out-file to export it to a file',
                ),
            );
            // no signing
            // Write unsigned tx to a file
            if (flags['out-file']) {
                writeToFile(
                    flags['out-file'],
                    JSON.stringify(
                        convertToCliTxDraft(txBody, txMetadata),
                        null,
                        4,
                    ),
                );
                console.log(
                    chalk.green(`Transaction exported to ${flags['out-file']}`),
                );
            }
        }

        if (flags['prometheus-exporter-file']) {
            const remainingBalance = CardanoWasm.BigNum.from_str(
                getRemainingBalance(utxos),
            ).clamped_sub(info.totalFeesAmount);
            writeToFile(
                flags['prometheus-exporter-file'],
                metrics.toPrometheus(remainingBalance.to_str()),
            );
            console.log(
                chalk.green(
                    `Prometheus metrics exported to ${flags['prometheus-exporter-file']}`,
                ),
            );
        }
    }

    async catch(error: CLIError): Promise<void> {
        const shouldPrint = !(error?.code === 'EEXIT');
        if (shouldPrint) {
            console.log(chalk.red(error));
        }
        process.exit(1);
    }
}

export = CardanoMetadataOracle;
