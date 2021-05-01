import {blockfrostAPI} from '../../utils/blockfrostAPI';

export const pushTransaction = async (transaction: Uint8Array) => {
    try {
        const response = await blockfrostAPI.txSubmit(transaction);
        return response;
    } catch (err) {
        if (err.response?.data) {
            console.log(err.response?.data);
            throw Error('Failed to push a transaction a network.');
        } else {
            throw err;
        }
    }
}

export const fetchUtxos = async (address: string) => {
    try {
        const response = await blockfrostAPI.addressesUtxosAll(address);
        return response;
    } catch (err) {
        if (err.response?.data) {
            console.log(err.response?.data);
            throw Error('Fetching UTXOs failed.');
        } else {
            throw err;
        }
    }
}
