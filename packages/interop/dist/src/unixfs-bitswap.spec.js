/* eslint-env mocha */
import { unixfs } from '@helia/unixfs';
import { expect } from 'aegir/chai';
import toBuffer from 'it-to-buffer';
import { CID } from 'multiformats/cid';
import { createHeliaNode } from './fixtures/create-helia.js';
import { createKuboNode } from './fixtures/create-kubo.js';
describe('@helia/unixfs - bitswap', () => {
    let helia;
    let unixFs;
    let kubo;
    beforeEach(async () => {
        helia = await createHeliaNode();
        unixFs = unixfs(helia);
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
    it('should add a large file to helia and fetch it from kubo', async () => {
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
        const cid = await unixFs.addFile(candidate);
        const bytes = await toBuffer(kubo.api.cat(CID.parse(cid.toString())));
        expect(bytes).to.equalBytes(toBuffer(input));
    });
    it('should add a large file to kubo and fetch it from helia', async () => {
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
        const bytes = await toBuffer(unixFs.cat(CID.parse(cid.toString())));
        expect(bytes).to.equalBytes(toBuffer(input));
    });
});
//# sourceMappingURL=unixfs-bitswap.spec.js.map