import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { Responses } from '@blockfrost/blockfrost-js';

export const sortUtxos = (
    utxos: Responses['address_utxo_content'],
): Responses['address_utxo_content'] => {
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
