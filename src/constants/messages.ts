export const ERROR = {
    FLAG_MISSING_SEED_OR_ADDR:
        'Missing required flag: --address or --seed-file',
    FLAG_INVALID_DERIVATION_PATH: 'Invalid derivation path',
    ENV_BLOCKFROST_PROJECT_ID_NOT_SET:
        'Environment variable BLOCKFROST_PROJECT_ID not set',
    ORIGIN_FILE_NO_DATA: 'No data sources specified in origin file.',
    ORIGIN_FILE_DOES_NOT_EXIST: 'Origin file does not exists.',
    ORIGIN_FILE_NOT_VALID: 'Invalid data in origin file.',
    REMOTE_DATA_NO_DATA:
        'No data downloaded from sources defined in origin file',
    UTXOS_EMPTY: 'No UTXOs available for the address.',
    UTXOS_FETCH_FAIL: 'Fetching UTXOs failed.',
    TRANSACTION_SUBMIT_FAIL: 'Failed to submit a transaction a network.',
    METADATA_ENCODE_FAIL: 'Failed to encode fetched data as metadata.',
    FILE_WRITE_FAIL: `Failed to write to a file`,
    MNEMONIC_PARSING_FAIL: `Failed to parse mnemonic.`,
    MNEMONIC_INVALID: `Mnemonic is not valid.`,
} as const;
