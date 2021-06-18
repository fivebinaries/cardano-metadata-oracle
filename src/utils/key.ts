import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { ERROR } from '../constants/messages';

const splitDerivationPath = (path: string) => {
    try {
        const tokens = path.split('/').map(t => parseInt(t));
        tokens.forEach(t => {
            if (Number.isNaN(t)) {
                throw Error(ERROR.FLAG_INVALID_DERIVATION_PATH);
            }
        });
        return tokens;
    } catch (err) {
        return null;
    }
};

export const parseDerivationPath = (path: string): number[] => {
    const tokens = splitDerivationPath(path);
    if (!tokens || tokens.length !== 3) {
        throw Error(ERROR.FLAG_INVALID_DERIVATION_PATH);
    }
    return tokens;
};

const harden = (num: number): number => {
    return 0x80000000 + num;
};

export const deriveAddressPrvKey = (
    bipPrvKey: CardanoWasm.Bip32PrivateKey,
    derivationPath: number[],
    testnet?: boolean,
): {
    signKey: CardanoWasm.PrivateKey;
    address: string;
} => {
    const networkId = testnet
        ? CardanoWasm.NetworkInfo.testnet().network_id()
        : CardanoWasm.NetworkInfo.mainnet().network_id();
    const accountIndex = derivationPath[0];
    const addressIndex = derivationPath[2];

    const accountKey = bipPrvKey
        .derive(harden(1852)) // purpose
        .derive(harden(1815)) // coin type
        .derive(harden(accountIndex)); // account #0

    const utxoKey = accountKey
        .derive(0) // external
        .derive(addressIndex);

    const stakeKey = accountKey
        .derive(2) // chimeric
        .derive(0)
        .to_public();

    const baseAddress = CardanoWasm.BaseAddress.new(
        networkId,
        CardanoWasm.StakeCredential.from_keyhash(
            utxoKey.to_public().to_raw_key().hash(),
        ),
        CardanoWasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
    );

    const address = baseAddress.to_address().to_bech32();

    return { signKey: utxoKey.to_raw_key(), address: address };
};
