import type { GetStore } from '../../unixfs.js';
import type { PBNode } from '@ipld/dag-pb';
import type { AbortOptions } from '@libp2p/interface';
/**
 * Estimate node size only based on DAGLink name and CID byte lengths
 * https://github.com/ipfs/go-unixfsnode/blob/37b47f1f917f1b2f54c207682f38886e49896ef9/data/builder/directory.go#L81-L96
 *
 * If the node is a hamt sharded directory the calculation is based on if it was a regular directory.
 */
export declare function isOverShardThreshold(node: PBNode, blockstore: GetStore, threshold: number, options: AbortOptions): Promise<boolean>;
//# sourceMappingURL=is-over-shard-threshold.d.ts.map