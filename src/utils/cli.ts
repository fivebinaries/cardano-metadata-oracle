import { cli } from 'cli-ux';
import { Responses } from '@blockfrost/blockfrost-js';
import { RemoteData } from '../types';

export const renderTransactionTable = (
    txId: string,
    fee: string,
    usedUtxos: Responses['address_utxo_content'],
) => {
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

export const renderMetadata = (data: RemoteData) => {
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
