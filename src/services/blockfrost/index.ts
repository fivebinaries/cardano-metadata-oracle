import axios from "axios";
import { UTXO } from "../../types";
export const API_URL = "https://cardano-testnet.blockfrost.io/api/v0";

export const pushTransaction = async (transaction: any, apiKey: string) => {
    try {
        const response = await axios.post(`${API_URL}/tx/submit`, transaction, {
            headers: {
                'project_id': apiKey,
                'Content-Type': 'application/cbor',
            },
        });
        return response.data;

    } catch (err) {
        if (err.response?.data) {
            console.log(err.response?.data);
            throw Error('Failed to push a transaction a network.');
        } else {
            throw err;
        }
    }
}


export const fetchUtxos = async (address: string, apiKey: string) => {
    try {
        const response = await axios.get<UTXO[]>(`${API_URL}/addresses/${address}/utxos`, {
            headers: {
                'project_id': apiKey,
            },
        });
        return response.data;

    } catch (err) {
        if (err.response?.data) {
            console.log(err.response?.data);
            throw Error('Fetching UTXOs failed.');
        } else {
            throw err;
        }
    }
}
