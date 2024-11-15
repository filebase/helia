import { expect } from 'aegir/chai';
import { importer } from 'ipfs-unixfs-importer';
import last from 'it-last';
export async function createShardedDirectory(blockstore, files = 1001) {
    const result = await last(importer((function* () {
        for (let i = 0; i < files; i++) {
            yield {
                path: `./file-${i}`,
                content: Uint8Array.from([0, 1, 2, 3, 4])
            };
        }
    }()), blockstore, {
        shardSplitThresholdBytes: 1,
        wrapWithDirectory: true
    }));
    if (result == null) {
        throw new Error('No result received from ipfs.addAll');
    }
    expect(result).to.have.nested.property('unixfs.type', 'hamt-sharded-directory', 'tried to create a shared directory but the result was not a shard');
    return result.cid;
}
//# sourceMappingURL=create-sharded-directory.js.map