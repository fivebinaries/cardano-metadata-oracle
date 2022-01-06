export const parseDataFromResponse = [
    {
        description: 'Parse number from nested field',
        data: {
            id: 'cardano',
            market_data: {
                current_price: {
                    btc: 4.511e-5,
                    czk: 30.52,
                    usd: 1.46,
                },
                circulating_supply: 32066390668.4135,
            },
        },
        path: '$.market_data.current_price.usd',
        result: '1.46',
    },
    {
        description: 'parse an object',
        data: {
            id: 'cardano',
            market_data: {
                current_price: {
                    btc: 4.511e-5,
                    czk: 30.52,
                    usd: 1.46,
                },
                circulating_supply: 32066390668.4135,
            },
        },
        path: '$.market_data.current_price',
        result: '{"btc":0.00004511,"czk":30.52,"usd":1.46}',
    },
    {
        description: 'Parse string',
        data: {
            id: 'cardano',
        },
        path: '$.id',
        result: 'cardano',
    },
    {
        description: 'Parse string that is longer than 64B',
        data: {
            id: 'cardano string that will certainly exceed the limit of 64B, for sure',
            market_data: {
                current_price: {
                    btc: 4.511e-5,
                    czk: 30.52,
                    usd: 1.46,
                },
                circulating_supply: 32066390668.4135,
            },
        },
        path: '$.id',
        result: null,
    },
    {
        description: 'Find item in a array',
        data: [
            {
                token: '8f52f6a88acf6127bc4758a16b6047afc4da7887feae121ec217b75a',
                price_change_dict: {
                    priceADAAsk: 0.92,
                    priceADABid: 0.89,
                    priceADA: 0.905,
                    priceADAChangeDay: 0,
                    priceADAChangeWeek: 0,
                },
            },
            {
                token: 'f555c46bad0731d080c9381d7fff6f82839946a66bd070d185e1ea2f',
                price_change_dict: {
                    priceADAAsk: 0.003,
                    priceADABid: 0.001,
                    priceADA: 0.002,
                    priceADAChangeDay: 0,
                    priceADAChangeWeek: 0,
                },
            },
        ],
        path: "$[?(@.token == 'f555c46bad0731d080c9381d7fff6f82839946a66bd070d185e1ea2f')].price_change_dict.priceADA",
        result: '0.002',
    },
];

export const fetchDataSources = [
    {
        description: 'basic fetch from 1 data source',
        data: {
            ada: [
                {
                    name: 'coinGecko',
                    url: 'https://mockedanyway.com',
                    path: '$.market_data.current_price.usd',
                },
            ],
        },
        response: {
            id: 'cardano',
            market_data: {
                current_price: {
                    btc: 4.511e-5,
                    czk: 30.52,
                    usd: 1.46,
                },
                circulating_supply: 32066390668.4135,
            },
        },
        result: { ada: [{ source: 'coinGecko', value: '1.46' }] },
    },
    {
        description:
            '1 data source with 2 endpoints, 2nd endpoint has invalid path',
        data: {
            ada: [
                {
                    name: 'endpoint1',
                    url: 'https://mockedanyway.com',
                    path: '$.market_data.current_price.usd',
                },
                {
                    name: 'endpoint2',
                    url: 'https://mockedanyway.com',
                    path: '$.market_data.current_price.eur',
                },
            ],
        },
        response: {
            id: 'cardano',
            market_data: {
                current_price: {
                    btc: 4.511e-5,
                    czk: 30.52,
                    usd: 1.46,
                },
                circulating_supply: 32066390668.4135,
            },
        },
        result: {
            ada: [{ source: 'endpoint1', value: '1.46' }],
        },
    },
    {
        description: '1 data source 2 endpoints, fetching first endpoint fails',
        data: {
            ada: [
                {
                    name: 'coinGecko',
                    url: 'https://mockedanyway.com',
                    path: '$.market_data.current_price.usd',
                },
                {
                    name: 'coinGecko',
                    url: 'https://mockedanyway.com',
                    path: '$.market_data.current_price.czk',
                },
            ],
        },
        response: [
            null,
            {
                id: 'cardano',
                market_data: {
                    current_price: {
                        btc: 4.511e-5,
                        czk: 30.52,
                        usd: 1.46,
                    },
                },
            },
        ],
        result: { ada: [{ source: 'coinGecko', value: '30.52' }] },
    },
    {
        description: 'Failed fetch (abort_on_failure=true)',
        data: {
            ada: [
                {
                    name: 'coinGecko',
                    url: 'https://mockedanyway.com',
                    path: '$.market_data.current_price.usd',
                    abort_on_failure: true,
                },
            ],
        },
        response: null,
        result: null,
    },
    {
        description: 'Failed fetch (abort_on_failure=false)',
        data: {
            ada: [
                {
                    name: 'coinGecko',
                    url: 'https://mockedanyway.com',
                    path: '$.market_data.current_price.usd',
                    abort_on_failure: false,
                },
            ],
        },
        response: null,
        result: null,
    },
    {
        description: 'no data at specified path (abort_on_failure=true)',
        data: {
            ada: [
                {
                    name: 'coinGecko',
                    url: 'https://mockedanyway.com',
                    path: '$.market_data.current_price.eur',
                    abort_on_failure: true,
                },
            ],
        },
        response: {
            id: 'cardano',
            market_data: {
                current_price: {
                    btc: 4.511e-5,
                    czk: 30.52,
                    usd: 1.46,
                },
            },
        },
        result: null,
    },
];
