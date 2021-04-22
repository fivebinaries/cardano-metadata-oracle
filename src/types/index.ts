export interface DataSourceEndpoint {
    name: string;
    source: string;
    path?: string;
    abort_on_failure?: boolean;
}

export interface DataSources {
    [sourceName: string]: DataSourceEndpoint[];
}

export interface RemoteData {
    [sourceName: string]: {
        source: DataSourceEndpoint['name'],
        value: any,
    }[];
}


export interface UTXO {
    tx_hash: string,
    tx_index: number,
    output_index: number,
    amount: {
        unit: string,
        quantity: number,
    }[]
}