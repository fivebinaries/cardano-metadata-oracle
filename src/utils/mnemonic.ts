import { readFileSync } from 'fs';
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { mnemonicToEntropy, validateMnemonic } from 'bip39';
import { ERROR } from '../constants/messages';

export const mnemonicFromFile = (filepath: string): string => {
    const data = readFileSync(filepath, 'utf-8');
    if (!data) {
        throw Error(ERROR.MNEMONIC_PARSING_FAIL);
    }
    const mnemonic = data.trim();
    const isValid = validateMnemonic(mnemonic);
    if (!isValid) {
        throw Error(ERROR.MNEMONIC_INVALID);
    }
    return mnemonic;
};

export const mnemonicToPrivateKey = (
    mnemonic: string,
): CardanoWasm.Bip32PrivateKey => {
    const entropy = mnemonicToEntropy(mnemonic);

    const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
        Buffer.from(entropy, 'hex'),
        Buffer.from(''),
    );

    return rootKey;
};
