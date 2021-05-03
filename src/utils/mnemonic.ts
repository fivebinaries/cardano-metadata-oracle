import { readFileSync } from "fs";
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import { mnemonicToEntropy, validateMnemonic } from "bip39";

export const mnemonicFromFile = (filepath: string) => {
    const data = readFileSync(filepath, 'utf-8');
    if (!data) {
        throw Error(`Can't parse mnemonic from '${filepath}.`)
    }
    const isValid = validateMnemonic(data);
    if (!isValid) {
        throw Error(`Mnemonic is not valid.`)
    }
    return data.trim();
};

export const mnemonicToPrivateKey = (mnemonic: string) => {
    const entropy = mnemonicToEntropy(mnemonic); // why trezor uses bip32.from_mnemonic_cardano

    const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
        Buffer.from(entropy, "hex"),
        Buffer.from("")
    );

    return rootKey;
};
