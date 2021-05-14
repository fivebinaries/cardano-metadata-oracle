import * as utils from '../../../src/utils/explorer';

describe('utils - explorer', () => {
    test('getExplorerLink', () => {
        expect(utils.getExplorerLink('transaction_test_id')).toEqual(
            'https://adastat.net/transactions/transaction_test_id',
        );
    });
});
