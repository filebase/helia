/* eslint-env mocha */
import { expect } from 'aegir/chai';
import { MemoryBlockstore } from 'blockstore-core';
import { identity } from 'multiformats/hashes/identity';
import { json } from '../src/index.js';
describe('get', () => {
    let blockstore;
    let j;
    let cid;
    beforeEach(async () => {
        blockstore = new MemoryBlockstore();
        j = json({ blockstore });
        cid = await j.add({
            hello: 'world'
        });
    });
    it('gets an object', async () => {
        const result = await j.get(cid);
        expect(result).to.deep.equal({
            hello: 'world'
        });
    });
    it('gets an object with a non-default hashing algorithm', async () => {
        const input = {
            hello: 'world'
        };
        const cid = await j.add(input, {
            hasher: identity
        });
        await expect(j.get(cid)).to.eventually.deep.equal(input);
    });
});
//# sourceMappingURL=get.spec.js.map