import { cli } from 'cli-ux';
import { RemoteData, UTXO } from '../types';

export const renderTransactionTable = (
    txId: string,
    fee: string,
    usedUtxos: UTXO[],
): void => {
    console.log();
    cli.table(
        [
            {
                txId,
                fee,
                usedUtxos,
            },
        ],
        {
            txId: {
                header: 'Transaction ID',
                minWidth: 30,
            },
            fee: {
                minWidth: 7,
            },
            usedUtxos: {
                header: 'Used UTXOs',
                get: row => row.usedUtxos.map(u => u.tx_hash).join('\n'),
            },
        },
        {},
    );
    console.log();
};

export const renderMetadata = (data: RemoteData): void => {
    const mappedData = Object.keys(data)
        .map(k => data[k].map(e => ({ ...e, sourceName: k })))
        .flatMap(u => u);
    console.log();
    cli.table(
        mappedData,
        {
            sourceName: {
                header: 'Source',
                minWidth: 14,
            },
            source: {
                header: 'Endpoint Name',
                minWidth: 18,
            },
            value: {
                minWidth: 7,
            },
        },
        {},
    );
    console.log();
};
