import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { UTXO } from '../types';

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
