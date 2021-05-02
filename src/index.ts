import * as chalk from "chalk";
import { cli } from "cli-ux";
import { Command, flags } from "@oclif/command";
import { composeMetadata } from "./transaction/composeMetadata";
import { fetchDataSources } from "./remote-data/fetchData";
import { parseFile } from "./remote-data/parseOriginFile";
import { fetchUtxos, pushTransaction } from "./services/blockfrost";
import { composeTransaction } from "./transaction/composeTransaction";
import { signTransaction } from "./transaction/signTransaction";
import { deriveAddressPrvKey, parseDerivationPath } from "./utils/key";
import { mnemonicFromFile, mnemonicToPrivateKey } from "./utils/mnemonic";
import { writeToFile } from "./utils/file";
import { Responses } from "@blockfrost/blockfrost-js";
import { getExplorerLink } from "./utils/explorer";
import { renderMetadata, renderTransactionTable } from "./utils/cli";
import { setBlockfrostClient } from "./utils/blockfrostAPI";

class CardanoMetadataOracle extends Command {
    static description = "describe the command here";

    static flags = {
        version: flags.version({ char: "v" }),
        help: flags.help({ char: "h" }),
        "origin-file": flags.string({
            description:
                "Path to the origin file which contains the list of origins",
            required: true,
        }),
        address: flags.string({
            description: "Address to build the transaction",
            required: false,
            exclusive: ["seed-file"],
        }),
        network: flags.string({
            description:
                "Specify the Cardano network (Optional, mainnet by default)",
            options: ["mainnet", "testnet"],
            default: "mainnet",
            required: false,
        }),
        "metadata-label": flags.integer({
            description:
                "Integer of the Cardano metadata label as per CIP10 (Optional, default 1968)",
            required: false,
            default: 1968,
        }),
        "write-to-file": flags.string({
            description: "Writes transaction to a file",
        }),
        "address-derivation-path": flags.string({
            description:
                "Derivation path for the address in 'account/chain/address' format",
            default: "0/0/0",
            required: false,
        }),
        "seed-file": flags.string({
            description:
                "File containing the ED25519-BIP32 seed phrase",
            required: false,
            exclusive: ["address"],
        }),
        blockfrost: flags.boolean({
            description:
                "Use Blockfrost.io for fetching UTXOs and pushing transaction to the blockchain. Reads project ID from env variable 'BLOCKFROST_PROJECT_ID'. (Required if not cardano-node-socket)",
            required: false,
            exclusive: ["cardano-node-socket"],
        }),
        "cardano-node-socket": flags.string({
            description:
                "Path to the cardano-node socket file",
            required: false,
            exclusive: ["blockfrost"],
        }),
    };

    async run() {
        const { flags } = this.parse(CardanoMetadataOracle);
        const blockfrostApiKey = process.env["BLOCKFROST_PROJECT_ID"];
        const testnet = flags.network === "testnet";

        // if (!flags.address && !flags['seed-file']) {
        //     throw Error(
        //         "Missing flag --address or --seed-file"
        //     );
        // }

        if (!flags["cardano-node-socket"]) {
            // if --cardano-node-socket flag is not provided, use Blockfrost API
            flags.blockfrost = true;
        }

        if (flags.blockfrost) {
            // Make sure API key is set in order to use Blockfrost API
            if (!blockfrostApiKey) {
                throw Error(
                    "Environment variable BLOCKFROST_PROJECT_ID not set"
                );
            }
            setBlockfrostClient(blockfrostApiKey, testnet);
        }

        try {
            let address = '';
            let signKey;

            if (flags['seed-file']) {
                // console.log("Generating address, signing key from seed file");
                const mnemonic = mnemonicFromFile(flags["seed-file"]);
                const prvKey = mnemonicToPrivateKey(mnemonic);
                const derivationPath = parseDerivationPath(
                    flags["address-derivation-path"]
                );
                const derivation = deriveAddressPrvKey(
                    prvKey,
                    derivationPath,
                    testnet
                );
                
                address = derivation.address;
                signKey = derivation.signKey;
                console.log(`Generated address ${address}`);
            } 
            else if (flags.address) {
                address = flags.address;
            }

            const dataSources = parseFile(flags["origin-file"]);

            if (!dataSources) {
                throw Error("No data sources specified in origin file.");
            }

            // Fetch metadata from remote endpoints
            cli.action.start('Fetching data from sources in origin file')
            // console.log("Fetching data from sources in origin file");
            const fetchedData = await fetchDataSources(dataSources);
            if (!fetchedData) {
                throw Error(
                    "No data downloaded from sources defined in origin file"
                );
            }
            cli.action.stop() 

            renderMetadata(fetchedData);

            // Compose metadata
            const composedMetadata = composeMetadata(
                fetchedData,
                flags["metadata-label"]
            );

            // Fetch utxos
            let utxos: Responses['address_utxo_content'] = [];
            if (flags.blockfrost && blockfrostApiKey) {
                cli.action.start("Fetching UTXOs");
                // console.log("Fetching UTXOs");
                const fetchedUtxos = await fetchUtxos(address);
                if (fetchedUtxos.length > 0) {
                    utxos = fetchedUtxos;
                } else {
                    throw Error("No UTXOs available for the address.");
                }
                cli.action.stop();
            }

            // cli.action.start("Building transaction");
            const { txId, txBody, txMetadata, info } = composeTransaction(
                address,
                composedMetadata,
                utxos
            );

            renderTransactionTable(txId, info.totalFeesAmount.to_str(), info.usedUtxos);

            if (signKey) {
                // set prvKey for signing if seed-file was provided

                // console.log("Signing transaction");
                const transaction = signTransaction(
                    txBody,
                    txMetadata,
                    signKey
                );

                // Write transaction to a file
                if (flags["write-to-file"]) {
                    writeToFile(flags["write-to-file"], transaction.to_bytes());
                }

                // Push transaction to network
                if (flags["blockfrost"] && blockfrostApiKey) {
                    const txId = await pushTransaction(transaction.to_bytes());
                    if (txId) {
                        console.log();
                        console.log(
                            chalk.green(
                                `Transaction submitted successfully: ${getExplorerLink(
                                    txId,
                                    testnet
                                )}`
                            )
                        );
                    }
                }
            } else {
                // Write draft ttx to a file
                if (flags["write-to-file"]) {
                    writeToFile(flags["write-to-file"], txBody.to_bytes());
                }
            }
        } catch (err) {
            console.log(chalk.red(err));
        }
    }
}

export = CardanoMetadataOracle;
