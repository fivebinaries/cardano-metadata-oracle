import { DataSourceEndpoint, DataSources, RemoteData } from '../types';
import * as rax from 'retry-axios';
import axios from 'axios';
import * as chalk from 'chalk';
import * as jp from 'jsonpath';

export const countBytesInString = (input: string): number =>
    encodeURI(input).split(/%..|./).length - 1;

export const fetchData = async (
    entry: DataSourceEndpoint,
    options?: { retry: boolean },
): Promise<unknown> => {
    if (options?.retry) {
        rax.attach();
    }

    try {
        const res = await axios.get(entry.source, {
            headers: { 'User-Agent': 'cardano-metadata-oracle' },
        });
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response) {
                console.log(
                    chalk.red(
                        `Error Response: ${err.response.status} ${err.response.statusText}`,
                    ),
                );
            } else if (err.request) {
                console.log(chalk.red(err.request));
            }
        } else {
            console.log(chalk.red(err.message));
        }
        return null;
    }
};

export const parseDataFromResponse = (
    data: unknown,
    path: string | undefined,
): string | null => {
    try {
        let parsedData = data;
        if (path) {
            parsedData = jp.query(data, path, 1)[0];
            if (!parsedData || parsedData === []) {
                // no data at specified path
                return null;
            }
        }

        const stringifiedData =
            typeof parsedData === 'string'
                ? parsedData
                : JSON.stringify(parsedData);

        const size = countBytesInString(stringifiedData);
        if (size > 64) {
            // there is 64B limit for metadata string
            console.log(
                chalk.red(
                    `Parsed string too long: ${stringifiedData} ${size}B, max = 64B`,
                ),
            );
            return null;
        }
        return stringifiedData;
    } catch (err) {
        return null;
    }
};

export const fetchDataSources = async (
    dataSource: DataSources,
): Promise<RemoteData | null> => {
    const enhancedDataSources: RemoteData = {};

    for (const source in dataSource) {
        const endpoints = dataSource[source];
        for (const endpoint of endpoints) {
            // console.log(`Fetching ${endpoint.source}:${endpoint.name}`)

            const data = await fetchData(endpoint, {
                retry: !endpoint.abort_on_failure,
            });
            if (!data) {
                console.log(
                    chalk.red(
                        `Failed to fetch ${endpoint.name} from ${endpoint.source}`,
                    ),
                );
                if (endpoint.abort_on_failure) {
                    return null;
                }
                continue;
            }

            const parsedData = parseDataFromResponse(data, endpoint.path);
            if (!parsedData) {
                console.log(
                    chalk.red(
                        `Failed to parse data ${endpoint.name} from ${endpoint.source}`,
                    ),
                );
                if (endpoint.abort_on_failure) {
                    return null;
                }
                continue;
            }
            // Create an object where key is name for the data source, source field is name for given endpoint, value stores fetched and parsed data
            if (!enhancedDataSources[source]) {
                enhancedDataSources[source] = [];
            }

            enhancedDataSources[source].push({
                source: endpoint.name,
                value: parsedData,
            });
        }
    }
    // If no data were added to the object return null
    return Object.keys(enhancedDataSources).length === 0
        ? null
        : enhancedDataSources;
};
