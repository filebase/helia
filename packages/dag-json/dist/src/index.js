/**
 * @packageDocumentation
 *
 * `@helia/dag-json` makes working with DAG-JSON {@link https://github.com/ipfs/helia Helia} simple & straightforward.
 *
 * See the {@link DAGJSON} interface for all available operations.
 *
 * @example
 *
 * ```typescript
 * import { createHelia } from 'helia'
 * import { dagJson } from '@helia/dag-json'
 * import { CID } from 'multiformats/cid'
 *
 * const helia = await createHelia()
 * const j = dagJson(helia)
 *
 * const cid = await j.add({
 *   hello: 'world'
 * })
 * const obj = await j.get(cid)
 *
 * console.info(obj)
 * // { hello: 'world' }
 * ```
 */
import * as codec from '@ipld/dag-json';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
class DefaultDAGJSON {
    components;
    constructor(components) {
        this.components = components;
    }
    async add(obj, options = {}) {
        const buf = codec.encode(obj);
        const hash = await (options.hasher ?? sha256).digest(buf);
        const cid = CID.createV1(codec.code, hash);
        await this.components.blockstore.put(cid, buf, options);
        return cid;
    }
    async get(cid, options = {}) {
        const buf = await this.components.blockstore.get(cid, options);
        return codec.decode(buf);
    }
}
/**
 * Create a {@link DAGJSON} instance for use with {@link https://github.com/ipfs/helia Helia}
 */
export function dagJson(helia) {
    return new DefaultDAGJSON(helia);
}
//# sourceMappingURL=index.js.map