import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
export async function createBlock(codec, block) {
    const mh = await sha256.digest(block);
    const cid = CID.createV1(codec, mh);
    return { cid, block };
}
export async function createAndPutBlock(codec, block, blockstore) {
    const result = await createBlock(codec, block);
    await blockstore.put(result.cid, block);
    return result.cid;
}
//# sourceMappingURL=create-block.js.map