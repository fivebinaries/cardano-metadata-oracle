import * as cbor from 'cbor';
export interface DataSourceEndpoint {
    name: string;
    source: string;
    path?: string;
    abort_on_failure?: boolean;
}

export interface DataSources {
    [ticker: string]: DataSourceEndpoint[];
}

export interface RemoteData {
    [ticker: string]: {
        source: DataSourceEndpoint['name'];
        value: string;
    }[];
}

export interface UTXO {
    tx_hash: string;
    output_index: number;
    amount: { unit: string; quantity: string }[];
}

export interface BlockchainClient {
    testnet: boolean;
    fetchUtxos(address: string): Promise<UTXO[]>;
    pushTransaction(transaction: Uint8Array): Promise<string>;
}

export interface TxFile {
    type: 'TxBodyMary' | 'Tx MaryEra';
    description: string;
    cborHex: string;
}

export interface IndefiniteArray<T> extends Array<T> {
    encodeCBOR: typeof cbor.Encoder.encodeIndefinite;
}
