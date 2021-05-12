import { DataSourceEndpoint, DataSources, RemoteData } from '../types';
import axios from 'axios';
import * as jp from 'jsonpath';

const fetchData = async (entry: DataSourceEndpoint) => {
    try {
        const res = await axios.get(entry.source);
        return res.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const parseDataFromResponse = (data: any, path: string | undefined) => {
    if (!path) {
        // No parsing needed if there is no json path provided
        return data;
    }

    let parsedData = jp.query(data, path);
    parsedData = parsedData.length === 1 ? parsedData[0] : parsedData;
    return parsedData;
};

export const fetchDataSources = async (dataSource: DataSources) => {
    const enhancedDataSources: RemoteData = {};

    for (const source in dataSource) {
        const endpoints = dataSource[source];
        for (const endpoint of endpoints) {
            // console.log(`Fetching ${endpoint.source}:${endpoint.name}`)
            const data = await fetchData(endpoint);
            if (!data) {
                console.log(
                    `Failed to fetch ${endpoint.name} from ${endpoint.source}`,
                );
                if (endpoint.abort_on_failure) {
                    return null;
                }
            }

            const parsedData = parseDataFromResponse(data, endpoint.path);
            if (!parsedData || parsedData.length === 0) {
                console.log(
                    `Failed to parse data ${endpoint.name} from ${endpoint.source}`,
                );
                if (endpoint.abort_on_failure) {
                    return null;
                }
            }
            // Create an object where key is name for the data source, source field is name for given endpoint, value stores fetched and parsed data
            if (!enhancedDataSources[source]) {
                enhancedDataSources[source] = [];
            }

            enhancedDataSources[source].push({
                source: endpoint.name,
                value:
                    typeof parsedData === 'string'
                        ? parsedData
                        : JSON.stringify(parsedData),
            });
        }
    }
    return enhancedDataSources;
};
