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
            'a40082825820c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a100825820c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a2000181825839009493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e32c728d3861e164cab28cb8f006448139c8f1740ffb8e7aa9e5232dc1a001bd67b021a0002ae05075820cc0d334b324f005ab04f890d55ef7ac8e2b81f5f89343c23185abf1c7544df89',
        result:
            '83a40082825820c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a100825820c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a2000181825839009493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e32c728d3861e164cab28cb8f006448139c8f1740ffb8e7aa9e5232dc1a001bd67b021a0002ae05075820cc0d334b324f005ab04f890d55ef7ac8e2b81f5f89343c23185abf1c7544df89a1008182582073fea80d424276ad0978d4fe5310e8bc2d485f5f6bb3bf87612989f112ad5a7d58405f37d3ce591779f88d760bc7400d0b7f43e721c1a4ba43980d261df002d241794656e262f092098eeb2538c8d9a7268bc22f73aba3e4959075373a863a55ad00a11907b0a267736f757263653182a266736f7572636573736f75726365203120656e64706f696e7420316576616c75656464617461a266736f7572636572736f757263653120656e64706f696e7420326576616c75656a3132333435362e37383967736f757263653281a266736f7572636573736f75726365203220656e64706f696e7420316576616c7565781a71776572747975696f706173646667686a6b6c7a786376626e6d',
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
