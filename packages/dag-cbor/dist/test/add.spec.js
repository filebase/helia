/* eslint-env mocha */
import { expect } from 'aegir/chai';
import { MemoryBlockstore } from 'blockstore-core';
import { identity } from 'multiformats/hashes/identity';
import { dagCbor } from '../src/index.js';
describe('put', () => {
    let blockstore;
    let d;
    beforeEach(async () => {
        blockstore = new MemoryBlockstore();
        d = dagCbor({ blockstore });
    });
    it('adds an object', async () => {
        const cid = await d.add({
            hello: 'world'
        });
        expect(`${cid}`).to.equal('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae');
    });
    it('adds an object with a non-default hashing algorithm', async () => {
        const cid = await d.add({
            hello: 'world'
        }, {
            hasher: identity
        });
        expect(`${cid}`).to.equal('bafyqadnbmvugk3dmn5sxo33snrsa');
    });
});
//# sourceMappingURL=add.spec.js.map