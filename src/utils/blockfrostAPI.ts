import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

if (!process.env.BLOCKFROST_PROJECT_ID) {
    throw Error('Specify BlockFrostAPI key')
}

const blockfrostAPI = new BlockFrostAPI({
  projectId: process.env.BLOCKFROST_PROJECT_ID,
});

export { blockfrostAPI };