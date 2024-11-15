/* eslint-env mocha */
import { expect } from 'aegir/chai';
import { MemoryBlockstore } from 'blockstore-core';
import { identity } from 'multiformats/hashes/identity';
import { dagJson } from '../src/index.js';
describe('get', () => {
    let blockstore;
    let d;
    let cid;
    beforeEach(async () => {
        blockstore = new MemoryBlockstore();
        d = dagJson({ blockstore });
        cid = await d.add({
            hello: 'world'
        });
    });
    it('gets an object', async () => {
        const result = await d.get(cid);
        expect(result).to.deep.equal({
            hello: 'world'
        });
    });
    it('gets an object with a non-default hashing algorithm', async () => {
        const input = {
            hello: 'world'
        };
        const cid = await d.add(input, {
            hasher: identity
        });
        await expect(d.get(cid)).to.eventually.deep.equal(input);
    });
});
//# sourceMappingURL=get.spec.js.map