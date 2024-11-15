/* eslint-env mocha */
import { expect } from 'aegir/chai';
import { MemoryBlockstore } from 'blockstore-core';
import { identity } from 'multiformats/hashes/identity';
import { dagJson } from '../src/index.js';
describe('put', () => {
    let blockstore;
    let d;
    beforeEach(async () => {
        blockstore = new MemoryBlockstore();
        d = dagJson({ blockstore });
    });
    it('adds an object', async () => {
        const cid = await d.add({
            hello: 'world'
        });
        expect(`${cid}`).to.equal('baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea');
    });
    it('adds an object with a non-default hashing algorithm', async () => {
        const cid = await d.add({
            hello: 'world'
        }, {
            hasher: identity
        });
        expect(`${cid}`).to.equal('baguqeaarpmrgqzlmnrxseorco5xxe3deej6q');
    });
});
//# sourceMappingURL=add.spec.js.map