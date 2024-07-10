import type { Directory } from './cid-to-directory.js';
import type { GetStore, PutStore } from '../../unixfs.js';
import type { PBNode } from '@ipld/dag-pb';
import type { AbortOptions } from '@libp2p/interface';
import type { CID, Version } from 'multiformats/cid';
export interface RmLinkOptions extends AbortOptions {
    shardSplitThresholdBytes: number;
    cidVersion: Version;
}
export interface RemoveLinkResult {
    node: PBNode;
    cid: CID;
}
export declare function removeLink(parent: Directory, name: string, blockstore: PutStore & GetStore, options: RmLinkOptions): Promise<RemoveLinkResult>;
//# sourceMappingURL=remove-link.d.ts.map