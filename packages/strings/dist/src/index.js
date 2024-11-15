/**
 * @packageDocumentation
 *
 * `@helia/strings` makes working with strings {@link https://github.com/ipfs/helia Helia} simple & straightforward.
 *
 * See the [API docs](https://ipfs.github.io/helia/modules/_helia_strings.html) for all available operations.
 *
 * @example
 *
 * ```typescript
 * import { createHelia } from 'helia'
 * import { strings } from '@helia/strings'
 * import { CID } from 'multiformats/cid'
 *
 * const helia = await createHelia()
 * const str = strings(helia)
 * const cid = await str.add('hello world')
 * const string = await str.get(cid)
 *
 * console.info(string)
 * // hello world
 * ```
 */
import { CID } from 'multiformats/cid';
import * as raw from 'multiformats/codecs/raw';
import { sha256 } from 'multiformats/hashes/sha2';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
class DefaultStrings {
    components;
    constructor(components) {
        this.components = components;
    }
    async add(string, options = {}) {
        const buf = uint8ArrayFromString(string);
        const hash = await (options.hasher ?? sha256).digest(buf);
        const codec = options.codec ?? raw;
        const cid = CID.createV1(codec.code, hash);
        await this.components.blockstore.put(cid, buf, options);
        return cid;
    }
    async get(cid, options = {}) {
        const buf = await this.components.blockstore.get(cid, options);
        return uint8ArrayToString(buf);
    }
}
/**
 * Create a {@link Strings} instance for use with {@link https://github.com/ipfs/helia Helia}
 */
export function strings(helia) {
    return new DefaultStrings(helia);
}
//# sourceMappingURL=index.js.map