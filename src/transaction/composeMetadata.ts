import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import * as chalk from 'chalk';
import { RemoteData } from '../types';

export const composeMetadata = (
    remoteData: RemoteData,
    metadataLabel: number,
): CardanoWasm.TransactionMetadatum => {
    const obj = {
        [metadataLabel]: remoteData,
    };

    try {
        const metadata = CardanoWasm.encode_json_str_to_metadatum(
            JSON.stringify(obj),
            CardanoWasm.MetadataJsonSchema.BasicConversions,
        );
        return metadata;
    } catch (err) {
        console.error(chalk.red(err));
        throw Error('Failed to encode fetched data as metadata.');
    }
};
