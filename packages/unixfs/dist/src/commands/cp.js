import { logger } from '@libp2p/logger';
import mergeOpts from 'merge-options';
import { InvalidParametersError } from '../errors.js';
import { addLink } from './utils/add-link.js';
import { cidToDirectory } from './utils/cid-to-directory.js';
import { cidToPBLink } from './utils/cid-to-pblink.js';
import { SHARD_SPLIT_THRESHOLD_BYTES } from './utils/constants.js';
const mergeOptions = mergeOpts.bind({ ignoreUndefined: true });
const log = logger('helia:unixfs:cp');
const defaultOptions = {
    force: false,
    shardSplitThresholdBytes: SHARD_SPLIT_THRESHOLD_BYTES
};
export async function cp(source, target, name, blockstore, options = {}) {
    const opts = mergeOptions(defaultOptions, options);
    if (name.includes('/')) {
        throw new InvalidParametersError('Name must not have slashes');
    }
    const [directory, pblink] = await Promise.all([
        cidToDirectory(target, blockstore, opts),
        cidToPBLink(source, name, blockstore, opts)
    ]);
    log('Adding %c as "%s" to %c', source, name, target);
    const result = await addLink(directory, pblink, blockstore, {
        allowOverwriting: opts.force,
        cidVersion: target.version,
        ...opts
    });
    return result.cid;
}
//# sourceMappingURL=cp.js.map