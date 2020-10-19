const {
    ApiPromise,
    WsProvider
} = require('@polkadot/api');

const network = 'wss://rpc.polkadot.io';

async function main() {
    console.log(`connecting to network ${network}...`);
    let count = 0;
    let latestblock = null;

    provider = new WsProvider(network);
    try {
        api = await ApiPromise.create({
            provider: provider
        });
    } catch (error) {
        console.log("Bad connection");
        return;
    }
    console.log("connected!\n");

    const unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
        if (latestblock != header.number) {
            latestblock = header.number;
            const blockHash = await api.rpc.chain.getBlockHash(latestblock);
            const blockHeader = await api.derive.chain.getHeader(blockHash);

            console.log(`Latest block number\t ${latestblock}`);
            console.log(`Latest block hash\t ${blockHash}`);
            console.log(`Latest block author\t ${blockHeader.author.toString()}`);

            console.log("---------------------\n");

            if (++count === 20) {
                unsubscribe();
                process.exit(0);
            }
        }
    });


}

main().catch(console.error);