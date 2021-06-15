import {
    countBytesInString,
    parseDataFromResponse,
    fetchDataSources,
    fetchData,
} from '../fetchData';
import * as nock from 'nock';
import * as fetchDataFunctions from '../fetchData';
import * as fixtures from './__fixtures__/';
import axios from 'axios';

axios.defaults.adapter = require('axios/lib/adapters/http');

describe('fetchData', () => {
    test('countBytesInString', () => {
        expect(countBytesInString('aaa')).toBe(3);
        expect(countBytesInString('č')).toBe(2);
        expect(countBytesInString('😀')).toBe(4);
        expect(countBytesInString('+ěčřěžšýžřšý')).toBe(23);
    });

    fixtures.parseDataFromResponse.forEach(f => {
        test(`parseDataFromResponse: ${f.description} `, () => {
            expect(parseDataFromResponse(f.data, f.path)).toBe(f.result);
        });
    });

    test(`fetchData: success response`, async () => {
        const spy = jest
            .spyOn(axios, 'get')
            .mockReturnValue(Promise.resolve({ data: 'downloaded data' }));
        expect(
            await fetchData({
                name: 'coinGecko',
                url: 'https://mockedanyway.com',
                path: '$.market_data.current_price.usd',
            }),
        ).toBe('downloaded data');
        expect(axios.get).toHaveBeenCalledWith('https://mockedanyway.com', {
            headers: { 'User-Agent': 'cardano-metadata-oracle' },
        });
        expect(axios.get).toHaveBeenCalledTimes(1);

        spy.mockRestore();
    });

    test(`fetchData (error.response)`, async () => {
        const spy = jest
            .spyOn(axios, 'get')
            .mockReturnValue(Promise.reject({ response: 'Failed' }));
        const spy2 = jest
            .spyOn(axios, 'isAxiosError')
            .mockImplementation(() => true);

        expect(
            await fetchData({
                name: 'coinGecko',
                url: 'https://mockedanyway.com',
                path: '$.market_data.current_price.usd',
            }),
        ).toBeNull();

        spy.mockRestore();
        spy2.mockRestore();
    });

    fixtures.fetchDataSources.forEach(f => {
        test(`fetchDataSources ${f.description}`, async () => {
            const spy = jest.spyOn(fetchDataFunctions, 'fetchData');

            // mock axios responses
            if (Array.isArray(f.response)) {
                // array of responses
                spy.mockReturnValueOnce(
                    Promise.resolve(f.response[0]),
                ).mockReturnValueOnce(Promise.resolve(f.response[1]));
            } else {
                spy.mockReturnValue(Promise.resolve(f.response));
            }

            const response = await fetchDataSources(f.data);
            if (typeof f.result === 'object' && f.result !== null) {
                expect(response).toMatchObject(f.result);
            } else {
                expect(response).toBe(f.result);
            }
            spy.mockRestore();
        });
    });

    test('fetchData: failed request, retry=true', async () => {
        nock('https://mockedanyway.com').get('/').reply(500);
        nock('https://mockedanyway.com').get('/').reply(429);
        nock('https://mockedanyway.com')
            .get('/')
            .reply(200, 'it works after all');

        const response = await fetchData(
            {
                name: 'coinGecko',
                url: 'https://mockedanyway.com',
                path: '$.market_data.current_price.usd',
            },
            { retry: true },
        );
        expect(response).toBe('it works after all');
        nock.restore();
    });

    test('fetchData: failed request, retry=false', async () => {
        nock('https://mockedanyway.com').get('/').reply(500);
        nock('https://mockedanyway.com').get('/').reply(429);
        nock('https://mockedanyway.com')
            .get('/')
            .reply(200, 'it works after all');

        const response = await fetchData({
            name: 'coinGecko',
            url: 'https://mockedanyway.com',
            path: '$.market_data.current_price.usd',
        });
        expect(response).toBe(null);
        nock.restore();
    });
});
