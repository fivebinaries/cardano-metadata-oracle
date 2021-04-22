import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";

const splitDerivationPath = (path: string) => {
    try {
        const tokens = path.split("/").map((t) => parseInt(t));
        return tokens;
    } catch (err) {
        return null;
    }
};

export const parseDerivationPath = (path: string) => {
    const tokens = splitDerivationPath(path);
    if (!tokens) {
        throw Error("Invalid derivation path.");
    }

    if (tokens.length !== 3) {
        throw Error("Invalid number of tokens.");
    }
    return tokens;
};

export const harden = (num: number): number => {
    return 0x80000000 + num;
};

export const findPrvKeyForAddress = (
    usedAddress: string,
    bipPrvKey: CardanoWasm.Bip32PrivateKey,
    derivationPath: number[],
    testnet?: boolean
) => {
    const networkId = testnet
        ? CardanoWasm.NetworkInfo.testnet().network_id()
        : CardanoWasm.NetworkInfo.mainnet().network_id();
    let accountIndex = derivationPath[0];
    let addressIndex = derivationPath[2];

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
            utxoKey.to_public().to_raw_key().hash()
        ),
        CardanoWasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash())
    );

    const address = baseAddress.to_address().to_bech32();
    if (usedAddress !== address) {
        throw Error("Derivation path doesn't match the address");
    }
    return utxoKey.to_raw_key();
};
