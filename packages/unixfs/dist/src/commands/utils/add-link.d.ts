import { CID, type Version } from 'multiformats/cid';
import type { Directory } from './cid-to-directory.js';
import type { GetStore, PutStore } from '../../unixfs.js';
import type { PBNode, PBLink } from '@ipld/dag-pb/interface';
import type { AbortOptions } from '@libp2p/interface';
export interface AddLinkResult {
    node: PBNode;
    cid: CID;
}
export interface AddLinkOptions extends AbortOptions {
    allowOverwriting: boolean;
    shardSplitThresholdBytes: number;
    cidVersion: Version;
}
export declare function addLink(parent: Directory, child: Required<PBLink>, blockstore: GetStore & PutStore, options: AddLinkOptions): Promise<AddLinkResult>;
//# sourceMappingURL=add-link.d.ts.map