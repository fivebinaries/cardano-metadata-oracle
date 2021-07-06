export const parseUtxo = [
    {
        description: '1 utxo (without amount unit)',
        data: `TxHash                                 TxIx        Lovelace
        ----------------------------------------------------------------------------------------
        bc8bf52ea894fb8e442fe3eea628be87d0c9a37baef185b70eb00a5c8a849d3b     0           2487217`,
        result: [
            {
                tx_hash:
                    'bc8bf52ea894fb8e442fe3eea628be87d0c9a37baef185b70eb00a5c8a849d3b',
                output_index: 0,
                amount: [
                    {
                        unit: 'lovelace',
                        quantity: '2487217',
                    },
                ],
            },
        ],
    },
    {
        description: '1 utxo (with amount unit)',

        data: `                           TxHash                                 TxIx        Amount
        --------------------------------------------------------------------------------------
        038e56300297bcbfd31d6535944f513db658050e37625d6c4728e669b7d87622     0        584439830 lovelace`,
        result: [
            {
                tx_hash:
                    '038e56300297bcbfd31d6535944f513db658050e37625d6c4728e669b7d87622',
                output_index: 0,
                amount: [
                    {
                        unit: 'lovelace',
                        quantity: '584439830',
                    },
                ],
            },
        ],
    },
    {
        description: 'multiple utxos',

        data: `                           TxHash                                 TxIx        Amount
        --------------------------------------------------------------------------------------
        b68d2acac7a60040e9e35d78ec24ef572757fb351ff1e703cb5eb93aafb452fe     0        1000000000 lovelace
        c34010482abcb65c5b6f6ef42635aa8a56cf5283988efa8aa2187e978ef4cb9b     0        544263998 lovelace`,
        result: [
            {
                tx_hash:
                    'b68d2acac7a60040e9e35d78ec24ef572757fb351ff1e703cb5eb93aafb452fe',
                output_index: 0,
                amount: [
                    {
                        unit: 'lovelace',
                        quantity: '1000000000',
                    },
                ],
            },
            {
                tx_hash:
                    'c34010482abcb65c5b6f6ef42635aa8a56cf5283988efa8aa2187e978ef4cb9b',
                output_index: 0,
                amount: [
                    {
                        unit: 'lovelace',
                        quantity: '544263998',
                    },
                ],
            },
        ],
    },
];

export const convertToCliTxDraft = [
    {
        description:
            'convert txBody & txMetadata to cardano-cli-compatible format (no options)',
        txBody: 'a400818258208911f640d452c3be4ff3d89db63b41ce048c056951286e2e28bbf8a51588ab44000181825839009493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e32c728d3861e164cab28cb8f006448139c8f1740ffb8e7aa9e5232dc1a10b2531f021a00029519075820cb798b0bce50604eaf2e0dc89367896b18f0a6ef6b32b57e3c9f83f8ee71e608',
        txMetadata:
            'a11864a267736f757263653182a266736f7572636573736f75726365203120656e64706f696e7420316576616c75656464617461a266736f7572636572736f757263653120656e64706f696e7420326576616c75656a3132333435362e37383967736f757263653281a266736f7572636573736f75726365203220656e64706f696e7420316576616c7565781a71776572747975696f706173646667686a6b6c7a786376626e6d',
        options: undefined,
        result: {
            type: 'TxBodyMary',
            description: '',
            cborHex:
                '83a400818258208911f640d452c3be4ff3d89db63b41ce048c056951286e2e28bbf8a51588ab44000181825839009493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e32c728d3861e164cab28cb8f006448139c8f1740ffb8e7aa9e5232dc1a10b2531f021a00029519075820cb798b0bce50604eaf2e0dc89367896b18f0a6ef6b32b57e3c9f83f8ee71e6089fffa11864a267736f757263653182a266736f7572636573736f75726365203120656e64706f696e7420316576616c75656464617461a266736f7572636572736f757263653120656e64706f696e7420326576616c75656a3132333435362e37383967736f757263653281a266736f7572636573736f75726365203220656e64706f696e7420316576616c7565781a71776572747975696f706173646667686a6b6c7a786376626e6d',
        },
    },
];

export const convertToCliTx = [
    {
        description:
            'convert signed tx to cardano-cli-compatible format (no options)',
        tx: '83a400818258208911f640d452c3be4ff3d89db63b41ce048c056951286e2e28bbf8a51588ab44000181825839009493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e32c728d3861e164cab28cb8f006448139c8f1740ffb8e7aa9e5232dc1a10b2531f021a00029519075820cb798b0bce50604eaf2e0dc89367896b18f0a6ef6b32b57e3c9f83f8ee71e608a1008182582073fea80d424276ad0978d4fe5310e8bc2d485f5f6bb3bf87612989f112ad5a7d5840c40425229749a9434763cf01b492057fd56d7091a6372eaa777a1c9b1ca508c914e6a4ee9c0d40fc10952ed668e9ad65378a28b149de6bd4204bd9f095b0a902a11907b0a1667469636b657281a266736f757263656b736f757263655f6e616d656576616c7565736675676961742076656e69616d206d696e7573',
        options: undefined,
        result: {
            type: 'Tx MaryEra',
            description: '',
            cborHex:
                '83a400818258208911f640d452c3be4ff3d89db63b41ce048c056951286e2e28bbf8a51588ab44000181825839009493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e32c728d3861e164cab28cb8f006448139c8f1740ffb8e7aa9e5232dc1a10b2531f021a00029519075820cb798b0bce50604eaf2e0dc89367896b18f0a6ef6b32b57e3c9f83f8ee71e608a1008182582073fea80d424276ad0978d4fe5310e8bc2d485f5f6bb3bf87612989f112ad5a7d5840c40425229749a9434763cf01b492057fd56d7091a6372eaa777a1c9b1ca508c914e6a4ee9c0d40fc10952ed668e9ad65378a28b149de6bd4204bd9f095b0a902a11907b0a1667469636b657281a266736f757263656b736f757263655f6e616d656576616c7565736675676961742076656e69616d206d696e7573',
        },
    },
];

export const buildUtxoCommand = [
    {
        description: 'cardano-cli query utxo (mainnet)',
        address: 'dummyAddress',
        testnet: false,
        result: 'cardano-cli query utxo --address dummyAddress --mainnet',
    },
    {
        description: 'cardano-cli query utxo (testnet)',
        address: 'dummyAddress',
        testnet: true,
        result: 'cardano-cli query utxo --address dummyAddress --testnet-magic 1097911063',
    },
];

export const buildSubmitCommand = [
    {
        description: 'cardano-cli submit tx command (mainnet)',
        txFile: 'filepath',
        testnet: false,
        result: 'cardano-cli transaction submit --tx-file filepath --mainnet',
    },
    {
        description: 'cardano-cli submit tx command (testnet)',
        txFile: 'filepath',
        testnet: true,
        result: 'cardano-cli transaction submit --tx-file filepath --testnet-magic 1097911063',
    },
];
