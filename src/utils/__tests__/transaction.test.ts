import * as utils from '../transaction';

const UTOXS = [
    {
        block: 'blockHash',
        tx_hash: 'hash1',
        tx_index: 1,
        output_index: 1,
        amount: [
            {
                unit: 'lovelace',
                quantity: '10',
            },
            {
                unit: 'vladimircoin',
                quantity: '1',
            },
        ],
    },
    {
        block: 'blockHash',
        tx_hash: 'hash2',
        tx_index: 1,
        output_index: 1,
        amount: [
            {
                unit: 'lovelace',
                quantity: '5',
            },
            {
                unit: 'vladimircoin',
                quantity: '2',
            },
        ],
    },
    {
        block: 'blockHash',
        tx_hash: 'hash3',
        tx_index: 1,
        output_index: 1,
        amount: [
            {
                unit: 'lovelace',
                quantity: '8',
            },
        ],
    },
    {
        block: 'hash1',
        tx_hash: 'hash4',
        tx_index: 1,
        output_index: 1,
        amount: [
            {
                unit: 'lovelace',
                quantity: '1',
            },
        ],
    },
];

describe('utils - transaction', () => {
    const sorted = [UTOXS[3], UTOXS[1], UTOXS[2], UTOXS[0]];
    test('sortUtxos', () => {
        expect(utils.sortUtxos(UTOXS)).toEqual(sorted);
    });

    test('sortUtxos', () => {
        expect(utils.getRemainingBalance(UTOXS)).toBe('24');
    });
});
