import * as utils from '../composeTransaction';
import { composeMetadata } from '../composeMetadata';
import { REMOTE_DATA } from './__fixtures__';
import { composeTransaction } from './__fixtures__';
const metadata = composeMetadata(REMOTE_DATA, 1968);

describe('utils - composeTransaction', () => {
    composeTransaction.forEach(f => {
        test(f.description, () => {
            const tx = utils.composeTransaction(f.address, metadata, f.utxos);

            // output amount
            if (tx.txBody.outputs().len() > 0) {
                expect(
                    tx.txBody.outputs().get(0).amount().coin().to_str(),
                ).toBe(f.result.outputAmount);
            } else {
                expect(f.result.outputAmount).toBe('0');
            }
            expect(tx.info.outputAmount.to_str()).toBe(f.result.outputAmount);

            // fee amount
            expect(tx.txBody.fee().to_str()).toBe(f.result.totalFeesAmount);
            expect(tx.info.totalFeesAmount.to_str()).toBe(
                f.result.totalFeesAmount,
            );

            expect(tx.info.usedUtxos).toMatchObject(f.result.usedUtxos);
            expect(tx.txMetadata).toBeTruthy();
        });
    });

    test('composeTransaction (utxo without lovelace)', () => {
        const tx = () =>
            utils.composeTransaction(
                'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp',
                metadata,
                [
                    {
                        tx_hash:
                            'c2d3af74aed2ff310890c2b54fce15ac42127959036ebc8261154fb4c0c9e0a2',
                        output_index: 0,
                        amount: [{ unit: 'token', quantity: '400000000' }],
                    },
                ],
            );
        expect(tx).toThrowError();
    });

    test('composeTransaction (no utxos)', () => {
        expect(() =>
            utils.composeTransaction(
                'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp',
                metadata,
                [],
            ),
        ).toThrowError();
    });
});
