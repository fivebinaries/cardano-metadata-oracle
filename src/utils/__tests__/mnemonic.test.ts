import * as utils from '../mnemonic';

describe('utils - key', () => {
    test('mnemonicFromFile (valid mnemonic)', () => {
        expect(
            utils.mnemonicFromFile(
                'src/utils/__tests__/__fixtures__/mnemonic.txt',
            ),
        ).toEqual(
            'test walk nut penalty hip pave soap entry language right filter choice',
        );
    });

    test('mnemonicFromFile (invalid mnemonic)', () => {
        expect(() =>
            utils.mnemonicFromFile(
                'src/utils/__tests__/__fixtures__/mnemonic_invalid.txt',
            ),
        ).toThrowError();
    });

    test('mnemonicFromFile (empty file)', () => {
        expect(() =>
            utils.mnemonicFromFile(
                'src/utils/__tests__/__fixtures__/mnemonic_empty.txt',
            ),
        ).toThrowError();
    });

    test('mnemonicToPrivateKey', () => {
        expect(
            utils
                .mnemonicToPrivateKey(
                    'test walk nut penalty hip pave soap entry language right filter choice',
                )
                .to_bech32(),
        ).toEqual(
            'xprv1vzrzr76vqyqlavclduhawqvtae2pq8lk0424q7t8rzfjyhhp530zxv2fwq5a3pd4vdzqtu6s2zxdjhww8xg4qwcs7y5dqne5k7mz27p6rcaath83rl20nz0v9nwdaga9fkufjuucza8vmny8qpkzwstk5quneyk9',
        );
    });
});
