import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { sortUtxos } from '../utils/transaction';
import { UTXO } from '../types';

export const composeTransaction = (
    address: string,
    metadatum: CardanoWasm.TransactionMetadatum,
    utxos: UTXO[],
): {
    txId: string;
    txBody: CardanoWasm.TransactionBody;
    txMetadata: CardanoWasm.AuxiliaryData;
    info: {
        usedUtxos: UTXO[];
        utxosTotalAmount: CardanoWasm.BigNum;
        totalFeesAmount: CardanoWasm.BigNum;
        outputAmount: CardanoWasm.BigNum;
    };
} => {
    if (!utxos || utxos.length === 0) {
        throw 'No UTXOs to include in the transaction.';
    }

    const minUtxoValue = CardanoWasm.BigNum.from_str('1000000');
    const txBuilder = CardanoWasm.TransactionBuilder.new(
        CardanoWasm.LinearFee.new(
            CardanoWasm.BigNum.from_str('44'),
            CardanoWasm.BigNum.from_str('155381'),
        ),
        minUtxoValue,
        // pool deposit
        CardanoWasm.BigNum.from_str('500000000'),
        // key deposit
        CardanoWasm.BigNum.from_str('2000000'),
    );

    const outputAddr = CardanoWasm.Address.from_bech32(address);

    let utxosTotalAmount = CardanoWasm.BigNum.from_str('0');
    let totalFeesAmount = CardanoWasm.BigNum.from_str('0');

    // set metadata
    const txMetadata = CardanoWasm.AuxiliaryData.from_bytes(
        metadatum.to_bytes(),
    );
    txBuilder.set_auxiliary_data(txMetadata);
    totalFeesAmount = txBuilder.min_fee();

    const testOutput = CardanoWasm.TransactionOutput.new(
        outputAddr,
        CardanoWasm.Value.new(minUtxoValue),
    );
    const outputFee = txBuilder.fee_for_output(testOutput);
    totalFeesAmount = totalFeesAmount.checked_add(outputFee);

    const lovelaceUtxos = utxos.filter(
        u => !u.amount.find(a => a.unit !== 'lovelace'),
    );
    const sortedUtxos = sortUtxos(lovelaceUtxos);
    const usedUtxos = [];
    for (const utxo of sortedUtxos) {
        const amount = utxo.amount.find(a => a.unit === 'lovelace')?.quantity;
        if (!amount) continue;

        const input = CardanoWasm.TransactionInput.new(
            CardanoWasm.TransactionHash.from_bytes(
                Buffer.from(utxo.tx_hash, 'hex'),
            ),
            utxo.output_index,
        );

        const inputValue = CardanoWasm.Value.new(
            CardanoWasm.BigNum.from_str(amount.toString()),
        );

        const inputFee = txBuilder.fee_for_input(outputAddr, input, inputValue);
        txBuilder.add_input(outputAddr, input, inputValue);

        totalFeesAmount = totalFeesAmount.checked_add(inputFee);
        utxosTotalAmount = utxosTotalAmount.checked_add(
            CardanoWasm.BigNum.from_str(amount.toString()),
        );
        usedUtxos.push(utxo);

        if (
            utxosTotalAmount.compare(
                totalFeesAmount.checked_add(minUtxoValue),
            ) >= 0
        ) {
            // we have enough utxos to cover fee + minUtxoOutput
            break;
        }
    }

    const outputAmount = utxosTotalAmount.checked_sub(totalFeesAmount);
    // add output to the tx
    txBuilder.add_output(
        CardanoWasm.TransactionOutput.new(
            outputAddr,
            CardanoWasm.Value.new(outputAmount),
        ),
    );

    txBuilder.set_fee(totalFeesAmount);

    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();
    const txId = Buffer.from(
        CardanoWasm.hash_transaction(txBody).to_bytes(),
    ).toString('hex');

    return {
        txId,
        txBody,
        txMetadata,
        info: {
            usedUtxos,
            utxosTotalAmount,
            totalFeesAmount,
            outputAmount,
        },
    };
};
