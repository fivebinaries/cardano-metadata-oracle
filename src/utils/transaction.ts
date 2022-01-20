import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { UTXO } from '../types';

export const bigNumFromStr = (num: string): CardanoWasm.BigNum =>
    CardanoWasm.BigNum.from_str(num);

export const getAssetAmount = (
    obj: Pick<UTXO, 'amount'>,
    asset = 'lovelace',
): string => obj.amount.find(a => a.unit === asset)?.quantity ?? '0';

export const sortUtxos = (utxos: UTXO[]): UTXO[] => {
    // smallest first
    return utxos.sort((a, b) => {
        const amountA = bigNumFromStr(getAssetAmount(a));
        const amountB = bigNumFromStr(getAssetAmount(b));
        return amountA.compare(amountB);
    });
};

export const getRemainingBalance = (utxos: UTXO[]): string => {
    let balance = bigNumFromStr('0');
    utxos.forEach(u => {
        balance = balance.checked_add(bigNumFromStr(getAssetAmount(u)));
    });
    return balance.to_str();
};
