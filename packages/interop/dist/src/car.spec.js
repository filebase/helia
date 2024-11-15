/* eslint-env mocha */
import { car } from '@helia/car';
import { unixfs } from '@helia/unixfs';
import { CarReader } from '@ipld/car';
import { expect } from 'aegir/chai';
import drain from 'it-drain';
import toBuffer from 'it-to-buffer';
import { CID } from 'multiformats/cid';
import { createHeliaNode } from './fixtures/create-helia.js';
import { createKuboNode } from './fixtures/create-kubo.js';
import { memoryCarWriter } from './fixtures/memory-car.js';
describe('@helia/car', () => {
    let helia;
    let c;
    let u;
    let kubo;
    beforeEach(async () => {
        helia = await createHeliaNode();
        c = car(helia);
        u = unixfs(helia);
        kubo = await createKuboNode();
        // connect helia to kubo
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
    it('should export a car from Helia, import and read the contents from kubo', async () => {
        const chunkSize = 1024 * 1024;
        const size = chunkSize * 10;
        const input = [];
        const candidate = {
            content: (async function* () {
                for (let i = 0; i < size; i += chunkSize) {
                    const buf = new Uint8Array(chunkSize);
                    input.push(buf);
                    yield buf;
                }
            }())
        };
        const cid = await u.addFile(candidate);
        const writer = memoryCarWriter(cid);
        await c.export(cid, writer);
        const buf = await writer.bytes();
        await drain(kubo.api.dag.import([buf]));
        const output = [];
        for await (const b of kubo.api.cat(cid)) {
            output.push(b);
        }
        expect(toBuffer(output)).to.equalBytes(toBuffer(input));
    });
    it('should export a car from kubo, import and read the contents from Helia', async () => {
        const chunkSize = 1024 * 1024;
        const size = chunkSize * 10;
        const input = [];
        const candidate = {
            content: (async function* () {
                for (let i = 0; i < size; i += chunkSize) {
                    const buf = new Uint8Array(chunkSize);
                    input.push(buf);
                    yield buf;
                }
            }())
        };
        const { cid } = await kubo.api.add(candidate.content);
        const bytes = await toBuffer(kubo.api.dag.export(cid));
        const reader = await CarReader.fromBytes(bytes);
        await c.import(reader);
        expect(await toBuffer(u.cat(CID.parse(cid.toString())))).to.equalBytes(toBuffer(input));
    });
});
//# sourceMappingURL=car.spec.js.map