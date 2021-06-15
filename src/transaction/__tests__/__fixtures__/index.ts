import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';

export const REMOTE_DATA = {
    source1: [
        { source: 'source 1 endpoint 1', value: 'data' },
        {
            source: 'source1 endpoint 2',
            value: '123456.789',
        },
    ],
    source2: [
        {
            source: 'source 2 endpoint 1',
            value: 'qwertyuiopasdfghjklzxcvbnm',
        },
    ],
};

// generated from mnemonic "test walk nut penalty hip pave soap entry language right filter choice"
export const PRV_KEY = CardanoWasm.Bip32PrivateKey.from_bech32(
    'xprv1vzrzr76vqyqlavclduhawqvtae2pq8lk0424q7t8rzfjyhhp530zxv2fwq5a3pd4vdzqtu6s2zxdjhww8xg4qwcs7y5dqne5k7mz27p6rcaath83rl20nz0v9nwdaga9fkufjuucza8vmny8qpkzwstk5quneyk9',
);

export const UTXOS = [
    {
        tx_hash:
            'c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a3',
        tx_index: 0,
        output_index: 0,
        amount: [{ unit: 'lovelace', quantity: '10000000000' }],
        block:
            'd42e18d2980f62474379c2b40d00e78825a00e6a788978e20ab14170531f1703',
    },
    {
        tx_hash:
            'c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a1',
        tx_index: 0,
        output_index: 0,
        amount: [{ unit: 'lovelace', quantity: '600000000' }],
        block:
            'd42e18d2980f62474379c2b40d00e78825a00e6a788978e20ab14170531f1703',
    },
    {
        tx_hash:
            'c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a2',
        tx_index: 0,
        output_index: 0,
        amount: [{ unit: 'lovelace', quantity: '400000000' }],
        block:
            'd42e18d2980f62474379c2b40d00e78825a00e6a788978e20ab14170531f1703',
    },
];

export const signTransaction = [
    {
        description: 'signTransaction',
        txBody:
            'a400818258208911f640d452c3be4ff3d89db63b41ce048c056951286e2e28bbf8a51588ab44000181825839009493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e32c728d3861e164cab28cb8f006448139c8f1740ffb8e7aa9e5232dc1a10b2531f021a00029519075820cb798b0bce50604eaf2e0dc89367896b18f0a6ef6b32b57e3c9f83f8ee71e608',
        txMetadata: {
            ticker: [{ source: 'source_name', value: 'fugiat veniam minus' }],
        },
        result:
            '83a400818258208911f640d452c3be4ff3d89db63b41ce048c056951286e2e28bbf8a51588ab44000181825839009493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e32c728d3861e164cab28cb8f006448139c8f1740ffb8e7aa9e5232dc1a10b2531f021a00029519075820cb798b0bce50604eaf2e0dc89367896b18f0a6ef6b32b57e3c9f83f8ee71e608a1008182582073fea80d424276ad0978d4fe5310e8bc2d485f5f6bb3bf87612989f112ad5a7d5840c40425229749a9434763cf01b492057fd56d7091a6372eaa777a1c9b1ca508c914e6a4ee9c0d40fc10952ed668e9ad65378a28b149de6bd4204bd9f095b0a902a11907b0a1667469636b657281a266736f757263656b736f757263655f6e616d656576616c7565736675676961742076656e69616d206d696e7573',
    },
];

export const composeTransaction = [
    {
        description: 'composeTransaction',
        address:
            'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp',
        utxos: [
            {
                tx_hash:
                    'c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a1',
                tx_index: 0,
                output_index: 0,
                amount: [{ unit: 'lovelace', quantity: '1000000' }],
                block:
                    'd42e18d2980f62474379c2b40d00e78825a00e6a788978e20ab14170531f1703',
            },
            {
                tx_hash:
                    'c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a2',
                tx_index: 0,
                output_index: 0,
                amount: [{ unit: 'lovelace', quantity: '1000000' }],
                block:
                    'd42e18d2980f62474379c2b40d00e78825a00e6a788978e20ab14170531f1703',
            },
        ],
        result: {
            outputAmount: '1824379',
            totalFeesAmount: '175621',
            usedUtxos: [
                {
                    amount: [{ quantity: '1000000', unit: 'lovelace' }],
                    block:
                        'd42e18d2980f62474379c2b40d00e78825a00e6a788978e20ab14170531f1703',
                    output_index: 0,
                    tx_hash:
                        'c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a1',
                    tx_index: 0,
                },
                {
                    amount: [{ quantity: '1000000', unit: 'lovelace' }],
                    block:
                        'd42e18d2980f62474379c2b40d00e78825a00e6a788978e20ab14170531f1703',
                    output_index: 0,
                    tx_hash:
                        'c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a2',
                    tx_index: 0,
                },
            ],
        },
    },
    {
        description: 'composeTransaction',
        address:
            'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp',
        utxos: [
            {
                tx_hash:
                    'c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a1',
                tx_index: 0,
                output_index: 0,
                amount: [{ unit: 'lovelace', quantity: '10000000' }],
                block:
                    'd42e18d2980f62474379c2b40d00e78825a00e6a788978e20ab14170531f1703',
            },
        ],
        result: {
            outputAmount: '9825963',
            totalFeesAmount: '174037',
            usedUtxos: [
                {
                    tx_hash:
                        'c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a1',
                    tx_index: 0,
                    output_index: 0,
                    amount: [{ unit: 'lovelace', quantity: '10000000' }],
                    block:
                        'd42e18d2980f62474379c2b40d00e78825a00e6a788978e20ab14170531f1703',
                },
            ],
        },
    },
];
