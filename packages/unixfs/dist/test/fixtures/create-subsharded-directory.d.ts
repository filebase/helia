import type { Blockstore } from 'interface-blockstore';
import type { CID } from 'multiformats/cid';
export declare function createSubshardedDirectory(blockstore: Blockstore, depth?: number, files?: number): Promise<{
    importerCid: CID;
    containingDirCid: CID;
    fileName: string;
}>;
//# sourceMappingURL=create-subsharded-directory.d.ts.map