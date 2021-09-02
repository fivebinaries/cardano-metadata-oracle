import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import {
    parseUtxo,
    convertToCliTxDraft,
    convertToCliTx,
    buildUtxoCommand,
    buildSubmitCommand,
} from '../cardano-node';
import * as fixtures from './__fixtures__';

describe('fetchData', () => {
    fixtures.parseUtxo.forEach(f => {
        test(`parseUtxo: ${f.description}`, () => {
            expect(parseUtxo(f.data)).toMatchObject(f.result);
        });
    });

    fixtures.convertToCliTxDraft.forEach(f => {
        test(`convertToCliTxDraft: ${f.description}`, () => {
            expect(
                convertToCliTxDraft(
                    CardanoWasm.TransactionBody.from_bytes(
                        Uint8Array.from(Buffer.from(f.txBody, 'hex')),
                    ),
                    CardanoWasm.AuxiliaryData.from_bytes(
                        Uint8Array.from(Buffer.from(f.txMetadata, 'hex')),
                    ),
                    f.options,
                ),
            ).toMatchObject(f.result);
        });
    });

    fixtures.convertToCliTx.forEach(f => {
        test(`convertToCliTx: ${f.description}`, () => {
            expect(
                convertToCliTx(
                    Uint8Array.from(Buffer.from(f.tx, 'hex')),
                    f.options,
                ),
            ).toMatchObject(f.result);
        });
    });

    fixtures.buildUtxoCommand.forEach(f => {
        test(`buildUtxoCommand: ${f.description}`, () => {
            expect(buildUtxoCommand(f.address, f.testnet)).toBe(f.result);
        });
    });

    fixtures.buildSubmitCommand.forEach(f => {
        test(`buildSubmitCommand: ${f.description}`, () => {
            expect(buildSubmitCommand(f.txFile, f.testnet)).toBe(f.result);
        });
    });
});
