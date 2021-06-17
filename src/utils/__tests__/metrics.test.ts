import { Metrics } from '../metrics';

describe('utils - metrics', () => {
    test('generateStats', () => {
        const m = new Metrics();
        const r = m.generateStats('123');
        expect(r).toMatchObject({
            cardano_metadata_oracle_balance: '123',
            cardano_metadata_oracle_last_run: expect.any(Number),
            cardano_metadata_oracle_exec_time: expect.any(Number),
        });
    });

    test('toPrometheus', () => {
        const m = new Metrics();
        const re = new RegExp(
            /cardano_metadata_oracle_balance 123\n\r?cardano_metadata_oracle_last_run \d+\n\r?cardano_metadata_oracle_exec_time \d/,
        );
        expect(m.toPrometheus('123')).toMatch(re);
    });
});
