import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { bigNumFromStr, getAssetAmount, sortUtxos } from '../utils/transaction';
import { UTXO } from '../types';
import { CARDANO_PARAMS } from '../constants/params';

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
    const txBuilder = CardanoWasm.TransactionBuilder.new(
        CardanoWasm.TransactionBuilderConfigBuilder.new()
            .fee_algo(
                CardanoWasm.LinearFee.new(
                    bigNumFromStr('44'),
                    bigNumFromStr('155381'),
                ),
            )
            .pool_deposit(bigNumFromStr('500000000'))
            .key_deposit(bigNumFromStr('2000000'))
            .coins_per_utxo_word(
                bigNumFromStr(CARDANO_PARAMS.COINS_PER_UTXO_WORD),
            )
            .max_value_size(CARDANO_PARAMS.MAX_VALUE_SIZE)
            .max_tx_size(CARDANO_PARAMS.MAX_TX_SIZE)
            .build(),
    );

    const outputAddr = CardanoWasm.Address.from_bech32(address);

    // Set metadata
    const txMetadata = CardanoWasm.AuxiliaryData.from_bytes(
        metadatum.to_bytes(),
    );
    txBuilder.set_auxiliary_data(txMetadata);

    // Dummy output for calculating needed fee for a change output
    const dummyOutput = CardanoWasm.TransactionOutput.new(
        outputAddr,
        CardanoWasm.Value.new(bigNumFromStr('1000000')),
    );
    const dummyOutputFee = txBuilder.fee_for_output(dummyOutput);

    // add inputs
    const usedUtxos = [];
    const lovelaceUtxos = utxos.filter(
        u => !u.amount.find(a => a.unit !== 'lovelace'),
    );
    const sorted = sortUtxos(lovelaceUtxos);
    let utxosTotalAmount = bigNumFromStr('0');
    const cUtxo = CardanoWasm.TransactionUnspentOutputs.new();
    for (const utxo of sorted) {
        const amount = getAssetAmount(utxo);
        if (!amount) continue;

        const input = CardanoWasm.TransactionInput.new(
            CardanoWasm.TransactionHash.from_bytes(
                Buffer.from(utxo.tx_hash, 'hex'),
            ),
            utxo.output_index,
        );
        const inputValue = CardanoWasm.Value.new(bigNumFromStr(amount));
        const singleUtxo = CardanoWasm.TransactionUnspentOutput.new(
            input,
            CardanoWasm.TransactionOutput.new(outputAddr, inputValue),
        );
        cUtxo.add(singleUtxo);
        txBuilder.add_input(outputAddr, input, inputValue);
        utxosTotalAmount = utxosTotalAmount.checked_add(bigNumFromStr(amount));
        usedUtxos.push(utxo);
        const fee = txBuilder.min_fee();
        if (
            utxosTotalAmount.compare(
                bigNumFromStr('1000000')
                    .checked_add(fee)
                    .checked_add(dummyOutputFee),
            ) >= 0
        ) {
            // enough utxo to cover change output
            break;
        }
    }

    // Coin selection and change output
    // Would be nice to use coinselection from CSL, but if there is an input with 1 ADA it will burn it all for fee
    // instead of adding another input and returning change output
    // txBuilder.add_inputs_from(
    //     cUtxo,
    //     CardanoWasm.CoinSelectionStrategyCIP2.LargestFirst,
    // );
    txBuilder.add_change_if_needed(outputAddr);

    // Build tx
    const txBody = txBuilder.build();
    const txId = Buffer.from(
        CardanoWasm.hash_transaction(txBody).to_bytes(),
    ).toString('hex');

    // Derive few unnecessary fields that are at least used in tests
    const totalFeesAmount = txBody.fee();
    let outputAmount = bigNumFromStr('0');

    // Fill usedUtxos from txBody.inputs()
    // const usedUtxos = [];
    // let utxosTotalAmount = bigNumFromStr('0');
    // for (let i = 0; i < txBody.inputs().len(); i++) {
    //     const utxo = txBody.inputs().get(i);
    //     const originalUtxo = utxos.find(
    //         u =>
    //             u.tx_hash ===
    //                 Buffer.from(utxo.transaction_id().to_bytes()).toString(
    //                     'hex',
    //                 ) && u.output_index === utxo.index(),
    //     );
    //     if (originalUtxo) {
    //         usedUtxos.push(originalUtxo);
    //         utxosTotalAmount = utxosTotalAmount.checked_add(
    //             bigNumFromStr(getAssetAmount(originalUtxo)),
    //         );
    //     }
    // }

    for (let i = 0; i < txBody.outputs().len(); i++) {
        const output = txBody.outputs().get(i);
        outputAmount = outputAmount.checked_add(output.amount().coin());
    }

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
