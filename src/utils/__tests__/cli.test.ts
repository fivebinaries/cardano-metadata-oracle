import * as utils from '../cli';

describe('utils - cli', () => {
    test('renderTransactionTable', () => {
        console.log = jest.fn();
        utils.renderTransactionTable('txid', '0.1', [
            {
                block: 'blockHash',
                tx_hash: 'hash',
                tx_index: 1,
                output_index: 1,
                amount: [
                    {
                        unit: 'lovelace',
                        quantity: '10',
                    },
                ],
            },
        ]);
        // TODO: test output of renderTransactionTable?
        expect(console.log).toBeCalledTimes(2);
    });
});
