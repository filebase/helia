import * as dagPb from '@ipld/dag-pb';
import * as raw from 'multiformats/codecs/raw';
/**
 * Dag walker for dag-pb CIDs
 */
const dagPbWalker = {
    codec: dagPb.code,
    *walk(block) {
        const node = dagPb.decode(block);
        yield* node.Links.map(l => l.Hash);
    }
};
const rawWalker = {
    codec: raw.code,
    *walk() {
        // no embedded CIDs in a raw block
    }
};
export const dagWalkers = {
    [dagPb.code]: dagPbWalker,
    [raw.code]: rawWalker
};
//# sourceMappingURL=dag-walkers.js.map