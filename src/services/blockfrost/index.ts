/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getClient } from '../../utils/blockfrostAPI';

export const pushTransaction = async (transaction: Uint8Array) => {
    const client = getClient();
    try {
        const response = await client!.txSubmit(transaction);
        return response;
    } catch (err) {
        if (err?.data) {
            console.log(err?.data);
        } else {
            console.log(err);
        }
        throw Error('Failed to push a transaction a network.');
    }
};

export const fetchUtxos = async (address: string) => {
    const client = getClient();
    try {
        const response = await client!.addressesUtxosAll(address);
        return response;
    } catch (err) {
        if (err?.data) {
            console.log(err?.data);
        } else {
            console.log(err);
        }
        throw Error('Fetching UTXOs failed.');
    }
};
