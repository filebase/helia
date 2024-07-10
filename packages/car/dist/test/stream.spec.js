/* eslint-env mocha */
import { unixfs } from '@helia/unixfs';
import { expect } from 'aegir/chai';
import { MemoryBlockstore } from 'blockstore-core';
import toBuffer from 'it-to-buffer';
import { car } from '../src/index.js';
import { dagWalkers } from './fixtures/dag-walkers.js';
import { smallFile } from './fixtures/files.js';
import { memoryCarWriter } from './fixtures/memory-car.js';
describe('stream car file', () => {
    let blockstore;
    let c;
    let u;
    beforeEach(async () => {
        blockstore = new MemoryBlockstore();
        c = car({ blockstore, dagWalkers });
        u = unixfs({ blockstore });
    });
    it('streams car file', async () => {
        const cid = await u.addBytes(smallFile);
        const writer = memoryCarWriter(cid);
        await c.export(cid, writer);
        const bytes = await writer.bytes();
        const streamed = await toBuffer(c.stream(cid));
        expect(bytes).to.equalBytes(streamed);
    });
});
//# sourceMappingURL=stream.spec.js.map