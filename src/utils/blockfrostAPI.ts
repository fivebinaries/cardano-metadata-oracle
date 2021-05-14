import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

let client: BlockFrostAPI | null = null;

export const setBlockfrostClient = (
    projectId: string,
    testnet?: boolean,
): void => {
    if (!client) {
        client = new BlockFrostAPI({
            projectId,
            isTestnet: testnet,
        });
    }
};

export const getClient = (): BlockFrostAPI | null => client;
