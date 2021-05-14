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
        source: DataSourceEndpoint['name'];
        value: string;
    }[];
}
