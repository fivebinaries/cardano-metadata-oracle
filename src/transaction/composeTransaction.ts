import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import {
    buildMultiAsset,
    getMinAdaRequired,
    sortUtxos,
} from '../utils/transaction';
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

    const protocolMinUtxoValue = CardanoWasm.BigNum.from_str('1000000');
    const txBuilder = CardanoWasm.TransactionBuilder.new(
        CardanoWasm.LinearFee.new(
            CardanoWasm.BigNum.from_str('44'),
            CardanoWasm.BigNum.from_str('155381'),
        ),
        protocolMinUtxoValue,
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

    const sortedUtxos = sortUtxos(utxos);
    const usedUtxos = [];
    let maxOutputFee = CardanoWasm.BigNum.from_str('0');
    let maxMinOutputAmount = protocolMinUtxoValue;
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

        const assets = utxo.amount.filter(a => a.unit !== 'lovelace');
        if (assets) {
            const multiAsset = CardanoWasm.MultiAsset.new();
            buildMultiAsset(multiAsset, assets);
            inputValue.set_multiasset(multiAsset);
        }

        const inputFee = txBuilder.fee_for_input(outputAddr, input, inputValue);
        txBuilder.add_input(outputAddr, input, inputValue);

        totalFeesAmount = totalFeesAmount.checked_add(inputFee);
        utxosTotalAmount = utxosTotalAmount.checked_add(
            CardanoWasm.BigNum.from_str(amount.toString()),
        );
        usedUtxos.push(utxo);

        let minOutputAmount = getMinAdaRequired(null);
        let outputValue = CardanoWasm.Value.new(minOutputAmount);

        // Include tokens from all used utxos to the output value to properly calculate minimal required ada amount
        const isMultiAsset = usedUtxos.find(u =>
            u.amount.find(a => a.unit !== 'lovelace'),
        );
        if (isMultiAsset) {
            const multiAsset = CardanoWasm.MultiAsset.new();
            usedUtxos.forEach(utxo => {
                const assets = utxo.amount.filter(a => a.unit !== 'lovelace');
                buildMultiAsset(multiAsset, assets);
            });

            minOutputAmount = getMinAdaRequired(multiAsset);
            outputValue = CardanoWasm.Value.new(minOutputAmount);
            outputValue.set_multiasset(multiAsset);

            if (minOutputAmount.compare(maxMinOutputAmount)) {
                maxMinOutputAmount = minOutputAmount;
            }
        }

        const testOutput = CardanoWasm.TransactionOutput.new(
            outputAddr,
            outputValue,
        );
        const outputFee = txBuilder.fee_for_output(testOutput);
        if (outputFee.compare(maxOutputFee)) {
            maxOutputFee = outputFee;
        }

        const requiredAmount = totalFeesAmount
            .checked_add(maxMinOutputAmount)
            .checked_add(maxOutputFee);

        if (utxosTotalAmount.compare(requiredAmount) >= 0) {
            totalFeesAmount = totalFeesAmount.checked_add(maxOutputFee);
            // we have enough utxos to cover fee + minUtxoOutput
            break;
        }
    }

    console.log('');

    const outputAmount = utxosTotalAmount.checked_sub(totalFeesAmount);
    // add output to the tx
    const multiAsset = CardanoWasm.MultiAsset.new();
    usedUtxos.forEach(utxo => {
        const assets = utxo.amount.filter(a => a.unit !== 'lovelace');
        buildMultiAsset(multiAsset, assets);
    });

    const outputValue = CardanoWasm.Value.new(outputAmount);
    outputValue.set_multiasset(multiAsset);
    txBuilder.add_output(
        CardanoWasm.TransactionOutput.new(outputAddr, outputValue),
    );

    txBuilder.set_fee(totalFeesAmount);
    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();
    const txId = Buffer.from(
        CardanoWasm.hash_transaction(txBody).to_bytes(),
    ).toString('hex');

    const info = {
        usedUtxos,
        utxosTotalAmount,
        totalFeesAmount,
        outputAmount,
    };

    console.log('utxosTotalAmount', info.utxosTotalAmount.to_str());
    console.log('totalFeesAmount', info.totalFeesAmount.to_str());
    console.log('outputAmount', info.outputAmount.to_str());
    return {
        txId,
        txBody,
        txMetadata,
        info,
    };
};
