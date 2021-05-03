export const getExplorerLink = (txId: string, testnet?: boolean) =>
    testnet
        ? `https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=${txId}`
        : `https://adastat.net/transactions/${txId}`;
