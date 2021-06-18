/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BlockFrostAPI, Responses } from '@blockfrost/blockfrost-js';
import { ERROR } from '../../constants/messages';
import { BlockchainClient } from '../../types';

type PartialUTXO = Pick<
    Responses['address_utxo_content'][number],
    'tx_hash' | 'output_index' | 'amount'
>;
export class BlockfrostClient implements BlockchainClient {
    testnet: boolean;
    apiKey: string;
    client: BlockFrostAPI;

    constructor(testnet: boolean, apiKey: string) {
        this.testnet = !!testnet;
        this.apiKey = apiKey;
        this.client = new BlockFrostAPI({
            projectId: this.apiKey,
            isTestnet: this.testnet,
        });
    }

    pushTransaction = async (transaction: Uint8Array): Promise<string> => {
        try {
            const response = await this.client.txSubmit(transaction);
            return response;
        } catch (err) {
            if (err?.data) {
                console.log(err?.data);
            } else {
                console.log(err);
            }
            throw Error(ERROR.TRANSACTION_SUBMIT_FAIL);
        }
    };

    fetchUtxos = async (address: string): Promise<PartialUTXO[]> => {
        try {
            const response = await this.client.addressesUtxosAll(address);
            return response;
        } catch (err) {
            if (err?.data) {
                console.log(err?.data);
            } else {
                console.log(err);
            }
            throw Error(ERROR.UTXOS_FETCH_FAIL);
        }
    };
}
