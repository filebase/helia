/* eslint-env mocha */
import { json } from '@helia/json';
import { expect } from 'aegir/chai';
import { CID } from 'multiformats/cid';
import * as jsonCodec from 'multiformats/codecs/json';
import { createHeliaNode } from './fixtures/create-helia.js';
import { createKuboNode } from './fixtures/create-kubo.js';
describe('@helia/json', () => {
    let helia;
    let j;
    let kubo;
    async function expectSameCid(data, heliaOpts = {}, kuboOpts = { format: 'json' }) {
        const heliaCid = await j.add(data(), heliaOpts);
        const kuboCid = await kubo.api.block.put(jsonCodec.encode(data()), kuboOpts);
        expect(heliaCid.toString()).to.equal(kuboCid.toString());
    }
    beforeEach(async () => {
        helia = await createHeliaNode();
        j = json(helia);
        kubo = await createKuboNode();
        await helia.libp2p.dial((await (kubo.api.id())).addresses);
    });
    afterEach(async () => {
        if (helia != null) {
            await helia.stop();
        }
        if (kubo != null) {
            await kubo.stop();
        }
    });
    it('should create the same CID for a string', async () => {
        const candidate = () => ({ hello: 'world' });
        await expectSameCid(candidate);
    });
    it('should add to helia and fetch from kubo', async () => {
        const input = { hello: 'world' };
        const cid = await j.add(input);
        const block = await kubo.api.block.get(cid);
        const output = jsonCodec.decode(block);
        expect(output).to.deep.equal(input);
    });
    it('should add to kubo and fetch from helia', async () => {
        const input = { hello: 'world' };
        const cid = await kubo.api.block.put(jsonCodec.encode(input));
        const output = await j.get(CID.parse(cid.toString()));
        expect(output).to.deep.equal(input);
    });
});
//# sourceMappingURL=json.spec.js.map