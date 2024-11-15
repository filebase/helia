import { CID } from 'multiformats/cid';
import type { Blockstore } from 'interface-blockstore';
export declare function createBlock<Codec extends number>(codec: Codec, block: Uint8Array): Promise<{
    cid: CID<unknown, Codec, 18>;
    block: Uint8Array;
}>;
export declare function createAndPutBlock<Codec extends number>(codec: Codec, block: Uint8Array, blockstore: Blockstore): Promise<CID<unknown, Codec, 18>>;
//# sourceMappingURL=create-block.d.ts.map