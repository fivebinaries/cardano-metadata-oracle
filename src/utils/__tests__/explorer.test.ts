import * as utils from '../explorer';

describe('utils - explorer', () => {
    test('getExplorerLink (mainnet)', () => {
        expect(utils.getExplorerLink('transaction_test_id')).toEqual(
            'https://adastat.net/transactions/transaction_test_id',
        );
    });

    test('getExplorerLink (testnet)', () => {
        expect(utils.getExplorerLink('transaction_test_id', true)).toEqual(
            'https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=transaction_test_id',
        );
    });
});
