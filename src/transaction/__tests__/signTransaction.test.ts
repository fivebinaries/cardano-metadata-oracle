import * as utils from '../signTransaction';
import { composeMetadata } from '../composeMetadata';
import * as fixtures from './__fixtures__';
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { deriveAddressPrvKey } from '../../utils/key';

const metadata = composeMetadata(fixtures.REMOTE_DATA, 1968);

describe('utils - signTransaction', () => {
    fixtures.signTransaction.forEach(f => {
        test(f.description, () => {
            const signedTx = utils.signTransaction(
                CardanoWasm.TransactionBody.from_bytes(
                    Uint8Array.from(Buffer.from(f.txBody, 'hex')),
                ),
                CardanoWasm.TransactionMetadata.from_bytes(metadata.to_bytes()),
                deriveAddressPrvKey(fixtures.PRV_KEY, [0, 0, 0]).signKey,
            );
            expect(Buffer.from(signedTx.to_bytes()).toString('hex')).toBe(
                f.result,
            );
        });
    });
});
