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
 * const helia = createHelia({
 *   // ... helia config
 * })
 * const fs = unixfs(helia)
 *
 * // add some UnixFS data
 * const cid = await fs.addBytes(fileData1)
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
 * const helia = createHelia({
 *   // ... helia config
 * })
 *
 * // import the car
 * const inStream = nodeFs.createReadStream('example.car')
 * const reader = await CarReader.fromIterable(inStream)
 *
 * await c.import(reader)
 * ```
 */
import { CarWriter } from '@ipld/car';
import type { DAGWalker } from '@helia/interface';
import type { GetBlockProgressEvents, PutManyBlocksProgressEvents } from '@helia/interface/blocks';
import type { CarReader } from '@ipld/car';
import type { AbortOptions } from '@libp2p/interfaces';
import type { Filter } from '@libp2p/utils/filters';
import type { Blockstore } from 'interface-blockstore';
import type { CID } from 'multiformats/cid';
import type { ProgressOptions } from 'progress-events';
export interface CarComponents {
    blockstore: Blockstore;
    dagWalkers: Record<number, DAGWalker>;
}
interface ExportCarOptions {
    blockFilter: Filter;
}
/**
 * The Car interface provides operations for importing and exporting Car files
 * from Helia's underlying blockstore.
 */
export interface Car {
    /**
     * Add all blocks in the passed CarReader to the blockstore.
     *
     * @example
     *
     * ```typescript
     * import fs from 'node:fs'
     * import { createHelia } from 'helia'
     * import { car } from '@helia/car
     * import { CarReader } from '@ipld/car'
     *
     * const helia = await createHelia()
     *
     * const inStream = fs.createReadStream('example.car')
     * const reader = await CarReader.fromIterable(inStream)
     *
     * const c = car(helia)
     * await c.import(reader)
     * ```
     */
    import(reader: Pick<CarReader, 'blocks'>, options?: AbortOptions & ProgressOptions<PutManyBlocksProgressEvents>): Promise<void>;
    /**
     * Store all blocks that make up one or more DAGs in a car file.
     *
     * @example
     *
     * ```typescript
     * import fs from 'node:fs'
     * import { Readable } from 'stream'
     * import { createHelia } from 'helia'
     * import { car } from '@helia/car
     * import { CID } from 'multiformats/cid'
     * import pEvent from 'p-event'
     *
     * const helia = await createHelia()
     * const cid = CID.parse('QmFoo...')
     *
     * const c = car(helia)
     *
     * const byteStream = await c.export(cid)
     * const output = fs.createWriteStream('example.car')
     * const eventPromise = pEvent(output, 'end')
     * Readable.from(byteStream).pipe(output)
     *
     * await eventPromise
     * ```
     */
    export(root: CID | CID[], writer: Pick<CarWriter, 'put' | 'close'>, options?: ExportCarOptions & AbortOptions & ProgressOptions<GetBlockProgressEvents>): Promise<void>;
    /**
     * Returns an AsyncGenerator that yields CAR file bytes.
     *
     * @example
     *
     * ```typescript
     * import { createHelia } from 'helia'
     * import { car } from '@helia/car
     * import { CID } from 'multiformats/cid'
     *
     * const helia = await createHelia()
     * const cid = CID.parse('QmFoo...')
     *
     * const c = car(helia)
     *
     * for (const buf of c.stream(cid)) {
     *   // store or send `buf` somewhere
     * }
     * ```
     */
    stream(root: CID | CID[], options?: AbortOptions & ProgressOptions<GetBlockProgressEvents>): AsyncGenerator<Uint8Array>;
}
/**
 * Create a {@link Car} instance for use with {@link https://github.com/ipfs/helia Helia}
 */
export declare function car(helia: {
    blockstore: Blockstore;
    dagWalkers: Record<number, DAGWalker>;
}, init?: any): Car;
export {};
//# sourceMappingURL=index.d.ts.map