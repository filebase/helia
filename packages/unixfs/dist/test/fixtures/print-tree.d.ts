import type { Blockstore } from 'interface-blockstore';
import type { CID } from 'multiformats/cid';
type GetStore = Pick<Blockstore, 'get'>;
export declare function printTree(cid: CID, blockstore: GetStore, name?: string, indent?: string): Promise<void>;
export {};
//# sourceMappingURL=print-tree.d.ts.map