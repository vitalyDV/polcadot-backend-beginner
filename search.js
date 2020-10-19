const {
    ApiPromise,
    WsProvider
} = require('@polkadot/api');

const network = 'wss://rpc.polkadot.io';
const search = process.argv.slice(2)[0] || false;

if (!search) {
    console.log('Nothing to search');
    process.exit();
}

async function start(search) {
    console.log(`connecting to network ${network}...`);
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
    console.log(`Searching for ${search}....\n`);

    let blockHash = 'Not found';
    let BlockNumber = 'Not found';
    try {
        if (search.substr(0, 2) == '0x') {
            blockHash = search;
            const blockHeader = await api.derive.chain.getHeader(blockHash);
            BlockNumber = blockHeader.number.toString();
        } else {
            BlockNumber = search;
            blockHash = await api.rpc.chain.getBlockHash(search);
        }
    } catch (error) {

    }
    console.log(`Searched block number\t ${BlockNumber}`);
    console.log(`Searched block hash\t ${blockHash}`);
    process.exit();
};
start(search);