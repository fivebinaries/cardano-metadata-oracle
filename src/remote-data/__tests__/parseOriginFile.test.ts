import { parseFile } from '../parseOriginFile';

describe('parseOriginFile', () => {
    test('parseOriginFile (valid files)', () => {
        expect(
            parseFile(
                'src/remote-data/__tests__/__fixtures__/origin_valid.yml',
            ),
        ).toMatchObject({
            ADAUSD: [
                {
                    abort_on_failure: true,
                    name: 'coinGecko',
                    path: '$.market_data.current_price.usd',
                    url: 'https://api.coingecko.com/api/v3/coins/cardano?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false',
                },
                {
                    name: 'cryptoCompare',
                    path: '$.ADA.USD',
                    url: 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ADA&tsyms=USD&api_key=6e49ae35d5ce92b382c90aca9eaf58fed9156099191f23bcd4b65b90fcabeb5e',
                },
            ],
            ticker: [
                {
                    name: 'source_name',
                    path: '$[2].title',
                    url: 'https://jsonplaceholder.typicode.com/todos/',
                },
            ],
        });
    });

    test('parseOriginFile (invalid files)', () => {
        expect(() => parseFile('file/does/not/exist')).toThrowError();

        // missing property source
        expect(() =>
            parseFile(
                'src/remote-data/__tests__/__fixtures__/origin_invalid1.yml',
            ),
        ).toThrowError();

        // abort_on_failure must be boolean
        expect(() =>
            parseFile(
                'src/remote-data/__tests__/__fixtures__/origin_invalid2.yml',
            ),
        ).toThrowError();

        // missing property path
        expect(() =>
            parseFile(
                'src/remote-data/__tests__/__fixtures__/origin_invalid3.yml',
            ),
        ).toThrowError();
    });
});
