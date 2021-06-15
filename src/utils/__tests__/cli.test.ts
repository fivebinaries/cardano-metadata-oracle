import * as utils from '../cli';

describe('utils - cli', () => {
    test('renderTransactionTable', () => {
        console.log = jest.fn();
        utils.renderTransactionTable('txid', '0.1', [
            {
                tx_hash: 'hash',
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
