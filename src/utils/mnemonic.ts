import { readFileSync } from 'fs';
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { mnemonicToEntropy, validateMnemonic } from 'bip39';

export const mnemonicFromFile = (filepath: string): string => {
    const data = readFileSync(filepath, 'utf-8');
    if (!data) {
        throw Error(`Can't parse mnemonic from '${filepath}.`);
    }
    const mnemonic = data.trim();
    const isValid = validateMnemonic(mnemonic);
    if (!isValid) {
        throw Error(`Mnemonic is not valid.`);
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
