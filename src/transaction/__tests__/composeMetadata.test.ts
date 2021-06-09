import * as utils from '../composeMetadata';
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { REMOTE_DATA } from './__fixtures__';

describe('utils - composeMetadata', () => {
    test('composeMetadata', () => {
        const spy = jest.spyOn(CardanoWasm, 'encode_json_str_to_metadatum');
        const metadata = utils.composeMetadata(REMOTE_DATA, 100);
        const hex = Buffer.from(metadata.to_bytes()).toString('hex');
        expect(hex).toBe(
            'a11864a267736f757263653182a266736f7572636573736f75726365203120656e64706f696e7420316576616c75656464617461a266736f7572636572736f757263653120656e64706f696e7420326576616c75656a3132333435362e37383967736f757263653281a266736f7572636573736f75726365203220656e64706f696e7420316576616c7565781a71776572747975696f706173646667686a6b6c7a786376626e6d',
        );
        expect(spy).toHaveBeenCalledTimes(1);
    });

    test('composeMetadata (throws error during serialization)', () => {
        expect(() =>
            utils.composeMetadata(
                // @ts-ignore
                { test: [{ source: 'source', value: new Promise() }] },
                100,
            ),
        ).toThrowError();
    });
});
