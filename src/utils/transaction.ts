import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { UTXO } from '../types';

export const buildMultiAsset = (
    multiAsset: CardanoWasm.MultiAsset,
    assets: {
        unit: string;
        quantity: string;
    }[],
): CardanoWasm.MultiAsset => {
    assets.forEach(assetEntry => {
        const asset = CardanoWasm.Assets.new();
        const { policyId, assetNameInHex } = parseAsset(assetEntry.unit);
        asset.insert(
            CardanoWasm.AssetName.new(Buffer.from(assetNameInHex, 'hex')),
            CardanoWasm.BigNum.from_str(assetEntry.quantity),
        );
        const scriptHash = CardanoWasm.ScriptHash.from_bytes(
            Buffer.from(policyId, 'hex'),
        );
        multiAsset.insert(scriptHash, asset);
    });
    return multiAsset;
};

export const getMinAdaRequired = (
    multiAsset: CardanoWasm.MultiAsset | null,
): CardanoWasm.BigNum => {
    const minUtxoValue = CardanoWasm.BigNum.from_str('1000000');
    if (!multiAsset) return minUtxoValue;
    const Value = CardanoWasm.Value.new(minUtxoValue);
    Value.set_multiasset(multiAsset);
    return CardanoWasm.min_ada_required(Value, minUtxoValue);
};

export const parseAsset = (
    hex: string,
): {
    policyId: string;
    assetNameInHex: string;
} => {
    const policyIdSize = 56;
    const policyId = hex.slice(0, policyIdSize);
    const assetNameInHex = hex.slice(policyIdSize);
    return {
        policyId,
        assetNameInHex,
    };
};

export const sortUtxos = (utxos: UTXO[]): UTXO[] => {
    return utxos.sort((a, b) => {
        const amountA = CardanoWasm.BigNum.from_str(
            a.amount.find(a => a.unit === 'lovelace')?.quantity ?? '0',
        );
        const amountB = CardanoWasm.BigNum.from_str(
            b.amount.find(a => a.unit === 'lovelace')?.quantity ?? '0',
        );
        return amountA.compare(amountB);
    });
};

export const getRemainingBalance = (utxos: UTXO[]): string => {
    let balance = CardanoWasm.BigNum.from_str('0');
    utxos.forEach(u => {
        balance = balance.checked_add(
            CardanoWasm.BigNum.from_str(
                u.amount.find(a => a.unit === 'lovelace')?.quantity ?? '0',
            ),
        );
    });
    return balance.to_str();
};
