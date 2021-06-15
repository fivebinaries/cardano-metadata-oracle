import { exec } from 'child_process';
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import * as tmp from 'tmp';
import * as cbor from 'cbor';
import { BlockchainClient, IndefiniteArray, TxFile, UTXO } from '../../types';
import { writeToFile } from '../../utils/file';

const buildNetworkParam = (testnet: boolean): string =>
    testnet
        ? `--testnet-magic ${CardanoWasm.NetworkInfo.testnet().protocol_magic()}`
        : '--mainnet';

export const buildSubmitCommand = (
    txFile: string,
    testnet: boolean,
): string => {
    const networkParam = buildNetworkParam(testnet);
    return `cardano-cli transaction submit --tx-file ${txFile} ${networkParam}`;
};

export const buildUtxoCommand = (address: string, testnet: boolean): string => {
    const networkParam = buildNetworkParam(testnet);
    return `cardano-cli query utxo --address ${address} ${networkParam}`;
};

export const convertToCliTx = (
    transaction: Uint8Array,
    options?: {
        description?: string;
    },
): TxFile => {
    const txHex = Buffer.from(transaction).toString('hex');
    return {
        type: 'Tx MaryEra',
        description: options?.description ?? '',
        cborHex: txHex,
    };
};

export const convertToCliTxDraft = (
    txBody: CardanoWasm.TransactionBody,
    txMetadata: CardanoWasm.TransactionMetadata,
    options?: {
        description?: string;
    },
): TxFile => {
    const indefiniteArray = new Array(0) as IndefiniteArray<number>;
    indefiniteArray.encodeCBOR = cbor.Encoder.encodeIndefinite;
    const txDraft = cbor.encode([
        cbor.decode(txBody.to_bytes()),
        indefiniteArray,
        cbor.decode(txMetadata.to_bytes()),
    ]);

    const txHex = Buffer.from(txDraft).toString('hex');
    return {
        type: 'TxBodyMary',
        description: options?.description ?? '',
        cborHex: txHex,
    };
};

export const parseUtxo = (input: string): UTXO[] => {
    // Parse utxos from cardano-cli output
    const lines = input.split(/\r?\n/);
    const utxoLines = lines.slice(2, lines.length); // 1st line is header, 2nd line is separator

    const utxos: UTXO[] = [];
    for (const line of utxoLines) {
        const trimmed = line.trim();
        const tokens = trimmed.split(/\s+/);

        // older version of cardano-cli returns utxo without unit (lovelace)
        if (tokens.length !== 4 && tokens.length !== 3) continue;
        const [txHash, txIndex, amount, unit = 'lovelace'] = tokens;

        const txIndexNum = parseInt(txIndex);
        if (Number.isNaN(txIndexNum)) continue;

        utxos.push({
            tx_hash: txHash,
            output_index: txIndexNum,
            amount: [{ unit: unit, quantity: amount }],
        });
    }
    return utxos;
};

export class CardanoNodeClient implements BlockchainClient {
    testnet: boolean;

    constructor(testnet: boolean) {
        this.testnet = !!testnet;
    }

    pushTransaction = async (transaction: Uint8Array): Promise<string> => {
        try {
            const tmpfile = tmp.fileSync();
            writeToFile(
                tmpfile.fd,
                JSON.stringify(convertToCliTx(transaction), null, 4),
            );
            const p = new Promise<string>((resolve, reject) => {
                exec(
                    buildSubmitCommand(tmpfile.name, true),
                    (error, stdout, stderr) => {
                        if (error) {
                            reject(error.message);
                        } else if (stderr) {
                            reject(stderr);
                        } else {
                            resolve(stdout);
                        }
                    },
                );
            });
            return p;
        } catch (err) {
            // this doesn't catch rejected promise
            throw Error('Failed to push a transaction a network.');
        }
    };

    fetchUtxos = async (address: string): Promise<UTXO[]> => {
        try {
            const p = new Promise<UTXO[]>((resolve, reject) => {
                exec(
                    buildUtxoCommand(address, true),
                    (error, stdout, stderr) => {
                        if (error) {
                            reject(error.message);
                        } else if (stderr) {
                            reject(stderr);
                        } else {
                            const utxos = parseUtxo(stdout);
                            resolve(utxos);
                        }
                    },
                );
            });
            return p;
        } catch (err) {
            // this doesn't catch rejected promise
            throw Error('Failed to fetch utxos transactions');
        }
    };
}
