import * as utils from '../key';
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';

// generated from mnemonic "test walk nut penalty hip pave soap entry language right filter choice"
const PRV_KEY = CardanoWasm.Bip32PrivateKey.from_bech32(
    'xprv1vzrzr76vqyqlavclduhawqvtae2pq8lk0424q7t8rzfjyhhp530zxv2fwq5a3pd4vdzqtu6s2zxdjhww8xg4qwcs7y5dqne5k7mz27p6rcaath83rl20nz0v9nwdaga9fkufjuucza8vmny8qpkzwstk5quneyk9',
);

describe('utils - key', () => {
    test('parseDerivationPath', () => {
        expect(utils.parseDerivationPath('0/0/0')).toEqual([0, 0, 0]);
        expect(utils.parseDerivationPath('1/0/0')).toEqual([1, 0, 0]);
        expect(() => utils.parseDerivationPath('0/0/0/0')).toThrowError();
        expect(() => utils.parseDerivationPath('0 0 0')).toThrowError();
        expect(() => utils.parseDerivationPath('abcde//')).toThrowError();
        expect(() => utils.parseDerivationPath('')).toThrowError();
    });

    test('deriveAddressPrvKey', () => {
        // mainnet
        expect(
            utils.deriveAddressPrvKey(PRV_KEY, [0, 0, 0], false),
        ).toMatchObject({
            address:
                'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwqfjkjv7',
        });
        // testnet
        expect(
            utils.deriveAddressPrvKey(PRV_KEY, [0, 0, 0], true),
        ).toMatchObject({
            address:
                'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp',
        });
    });
});
