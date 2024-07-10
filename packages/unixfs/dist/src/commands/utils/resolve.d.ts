import type { GetStore, PutStore } from '../../unixfs.js';
import type { AbortOptions } from '@libp2p/interface';
import type { CID } from 'multiformats/cid';
export interface Segment {
    name: string;
    cid: CID;
    size: bigint;
}
export interface ResolveResult {
    /**
     * The CID at the end of the path
     */
    cid: CID;
    path?: string;
    /**
     * If present, these are the CIDs and path segments that were traversed through to reach the final CID
     *
     * If not present, there was no path passed or the path was an empty string
     */
    segments?: Segment[];
}
export declare function resolve(cid: CID, path: string | undefined, blockstore: GetStore, options: AbortOptions): Promise<ResolveResult>;
export interface UpdatePathCidsOptions extends AbortOptions {
    shardSplitThresholdBytes: number;
}
/**
 * Where we have descended into a DAG to update a child node, ascend up the DAG creating
 * new hashes and blocks for the changed content
 */
export declare function updatePathCids(cid: CID, result: ResolveResult, blockstore: PutStore & GetStore, options: UpdatePathCidsOptions): Promise<CID>;
//# sourceMappingURL=resolve.d.ts.map