import {
    EthereumProject,
    EthereumDatasourceKind,
    EthereumHandlerKind,
} from "@subql/types-ethereum";

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
    specVersion: "1.0.0",
    version: "0.0.1",
    name: "polygon-mumbai-starter",
    description:
        "This project can be use as a starting point for developing your new polygon Mumbai SubQuery project",
    runner: {
        node: {
            name: "@subql/node-ethereum",
            version: ">=3.0.0",
        },
        query: {
            name: "@subql/query",
            version: "*",
        },
    },
    schema: {
        file: "./schema.graphql",
    },
    network: {
        /**
         * chainId is the EVM Chain ID, for Polygon this is 80001
         * https://chainlist.org/chain/80001
         */
        chainId:
            "80001",
        /**
         * This endpoint must be a public non-pruned archive node
         * Public nodes may be rate limited, which can affect indexing speed
         * When developing your project we suggest getting a private API key
         * You can get them from OnFinality for free https://app.onfinality.io
         * https://documentation.onfinality.io/support/the-enhanced-api-service
         */
        endpoint: ["https://polygon-mumbai.blockpi.network/v1/rpc/public"],
        // Recommended to provide the HTTP endpoint of a full chain dictionary to speed up processing
        dictionary: "https://dict-tyk.subquery.network/query/polygon-mumbai"
    },
    dataSources: [
        {
            kind: EthereumDatasourceKind.Runtime,
            startBlock: 29605828, // This is the block that the contract was deployed on
            options: {
                // Must be a key of assets
                abi:'erc20',
                // This is the contract address for Wrapped Ether https://mumbai.polygonscan.com/token/0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa
                address:'0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa'
            },
            assets: new Map([
                ['erc20', { file: "./abis/erc20.abi.json" }],
            ]),
            mapping: {
                file: "./dist/index.js",
                handlers: [
                    {
                        kind: EthereumHandlerKind.Call,
                        handler: "handleTransaction",
                        filter: {
                            /**
                             * The function can either be the function fragment or signature
                             * function: '0x095ea7b3'
                             * function: '0x7ff36ab500000000000000000000000000000000000000000000000000000000'
                             */
                            function: "approve(address spender, uint256 rawAmount)",
                        },
                    },
                    {
                        kind: EthereumHandlerKind.Event,
                        handler: "handleLog",
                        filter: {
                            /**
                             * Follows standard log filters https://docs.ethers.io/v5/concepts/events/
                             * address: "0x60781C2586D68229fde47564546784ab3fACA982"
                             */
                            topics: ["Transfer(address indexed from, address indexed to, uint256 amount)"],
                        },
                    },
                ],
            },
        },
    ],
    repository: "https://github.com/subquery/ethereum-subql-starter"
};

export default project;