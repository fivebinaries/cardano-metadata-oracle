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
        const res = await axios.get(entry.url, {
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
    dataSources: DataSources,
): Promise<RemoteData | null> => {
    const enhancedDataSources: RemoteData = {};
    const promises: {
        ticker: string;
        endpoint: DataSourceEndpoint;
        promise: Promise<unknown>;
    }[] = [];
    for (const ticker in dataSources) {
        const endpoints = dataSources[ticker];
        for (const endpoint of endpoints) {
            // console.log(`Fetching ${ticker}:${endpoint.name}`)
            promises.push({
                ticker,
                endpoint,
                promise: fetchData(endpoint, {
                    retry: !endpoint.abort_on_failure,
                }).catch(() => {
                    // catch error so Promise.all below won't reject after first failed request
                }),
            });
        }
    }

    const responses = await Promise.all(promises.map(p => p.promise));
    for (const [i, data] of responses.entries()) {
        const ticker = promises[i].ticker;
        const endpoint = promises[i].endpoint;
        if (!data) {
            console.log(
                chalk.red(
                    `Failed to fetch ${endpoint.name} from ${endpoint.url}`,
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
                    `Failed to parse data ${endpoint.name} from ${endpoint.url}`,
                ),
            );
            if (endpoint.abort_on_failure) {
                return null;
            }
            continue;
        }
        // Create an object where key is name for the data source, source field is name for given endpoint, value stores fetched and parsed data
        if (!enhancedDataSources[ticker]) {
            enhancedDataSources[ticker] = [];
        }

        enhancedDataSources[ticker].push({
            source: endpoint.name,
            value: parsedData,
        });
    }

    // If no data were added to the object return null
    return Object.keys(enhancedDataSources).length === 0
        ? null
        : enhancedDataSources;
};
