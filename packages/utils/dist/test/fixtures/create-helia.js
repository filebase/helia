import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';
import { Helia as HeliaClass } from '../../src/index.js';
export async function createHelia(opts = {}) {
    const datastore = new MemoryDatastore();
    const blockstore = new MemoryBlockstore();
    const init = {
        datastore,
        blockstore,
        blockBrokers: [],
        holdGcLock: true,
        ...opts
    };
    const node = new HeliaClass(init);
    if (opts.start !== false) {
        await node.start();
    }
    return node;
}
//# sourceMappingURL=create-helia.js.map