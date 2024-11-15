/**
 * @packageDocumentation
 *
 * `@helia/car` provides `import` and `export` methods to read/write Car files to {@link https://github.com/ipfs/helia Helia}'s blockstore.
 *
 * See the {@link Car} interface for all available operations.
 *
 * By default it supports `dag-pb`, `dag-cbor`, `dag-json` and `raw` CIDs, more esoteric DAG walkers can be passed as an init option.
 *
 * @example Exporting a DAG as a CAR file
 *
 * ```typescript
 * import { createHelia } from 'helia'
 * import { unixfs } from '@helia/unixfs'
 * import { car } from '@helia/car'
 * import { CarWriter } from '@ipld/car'
 * import { Readable } from 'node:stream'
 * import nodeFs from 'node:fs'
 *
 * const helia = await createHelia({
 *   // ... helia config
 * })
 * const fs = unixfs(helia)
 *
 * // add some UnixFS data
 * const cid = await fs.addBytes(Uint8Array.from([0, 1, 2, 3, 4]))
 *
 * // export it as a Car
 * const c = car(helia)
 * const { writer, out } = await CarWriter.create(cid)
 *
 * // `out` needs to be directed somewhere, see the @ipld/car docs for more information
 * Readable.from(out).pipe(nodeFs.createWriteStream('example.car'))
 *
 * // write the DAG behind `cid` into the writer
 * await c.export(cid, writer)
 * ```
 *
 * @example Importing all blocks from a CAR file
 *
 * ```typescript
 * import { createHelia } from 'helia'
 * import { unixfs } from '@helia/unixfs'
 * import { car } from '@helia/car'
 * import { CarReader } from '@ipld/car'
 * import { Readable } from 'node:stream'
 * import nodeFs from 'node:fs'
 *
 * const helia = await createHelia({
 *   // ... helia config
 * })
 *
 * // import the car
 * const inStream = nodeFs.createReadStream('example.car')
 * const reader = await CarReader.fromIterable(inStream)
 *
 * const c = car(helia)
 * await c.import(reader)
 * ```
 */
import { CarWriter } from '@ipld/car';
import drain from 'it-drain';
import map from 'it-map';
import { createUnsafe } from 'multiformats/block';
import defer from 'p-defer';
import PQueue from 'p-queue';
const DAG_WALK_QUEUE_CONCURRENCY = 1;
class DefaultCar {
    components;
    constructor(components, init) {
        this.components = components;
    }
    async import(reader, options) {
        await drain(this.components.blockstore.putMany(map(reader.blocks(), ({ cid, bytes }) => ({ cid, block: bytes })), options));
    }
    async export(root, writer, options) {
        const deferred = defer();
        const roots = Array.isArray(root) ? root : [root];
        // use a queue to walk the DAG instead of recursion so we can traverse very large DAGs
        const queue = new PQueue({
            concurrency: DAG_WALK_QUEUE_CONCURRENCY
        });
        queue.on('idle', () => {
            deferred.resolve();
        });
        queue.on('error', (err) => {
            queue.clear();
            deferred.reject(err);
        });
        for (const root of roots) {
            void queue.add(async () => {
                await this.#walkDag(root, queue, async (cid, bytes) => {
                    // if a filter has been passed, skip blocks that have already been written
                    if (options?.blockFilter?.has(cid.multihash.bytes) === true) {
                        return;
                    }
                    options?.blockFilter?.add(cid.multihash.bytes);
                    await writer.put({ cid, bytes });
                }, options);
            })
                .catch(() => { });
        }
        // wait for the writer to end
        try {
            await deferred.promise;
        }
        finally {
            await writer.close();
        }
    }
    async *stream(root, options) {
        const { writer, out } = CarWriter.create(root);
        // has to be done async so we write to `writer` and read from `out` at the
        // same time
        this.export(root, writer, options)
            .catch(() => { });
        for await (const buf of out) {
            yield buf;
        }
    }
    /**
     * Walk the DAG behind the passed CID, ensure all blocks are present in the blockstore
     * and update the pin count for them
     */
    async #walkDag(cid, queue, withBlock, options) {
        const codec = await this.components.getCodec(cid.code);
        const bytes = await this.components.blockstore.get(cid, options);
        await withBlock(cid, bytes);
        const block = createUnsafe({ bytes, cid, codec });
        // walk dag, ensure all blocks are present
        for await (const [, cid] of block.links()) {
            void queue.add(async () => {
                await this.#walkDag(cid, queue, withBlock, options);
            });
        }
    }
}
/**
 * Create a {@link Car} instance for use with {@link https://github.com/ipfs/helia Helia}
 */
export function car(helia, init = {}) {
    return new DefaultCar(helia, init);
}
//# sourceMappingURL=index.js.map