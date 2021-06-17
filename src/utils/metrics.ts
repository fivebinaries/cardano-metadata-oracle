export class Metrics {
    timestampStart: number;
    timestampEnd: number | undefined;
    balance: string | undefined;

    constructor() {
        this.timestampStart = new Date().getTime();
    }

    generateStats = (
        balance: string,
    ): {
        cardano_metadata_oracle_balance: string;
        cardano_metadata_oracle_last_run: number;
        cardano_metadata_oracle_exec_time: number;
    } => {
        this.balance = balance;
        this.timestampEnd = new Date().getTime();

        return {
            cardano_metadata_oracle_balance: balance,
            cardano_metadata_oracle_last_run: Math.ceil(
                this.timestampStart / 1000,
            ),
            cardano_metadata_oracle_exec_time: Math.ceil(
                this.timestampEnd - this.timestampStart,
            ),
        };
    };

    toPrometheus = (balance: string): string => {
        const lines = [];
        const stats = this.generateStats(balance);
        for (const [key, value] of Object.entries(stats)) {
            lines.push(`${key} ${value}`);
        }
        return lines.join('\n');
    };
}
