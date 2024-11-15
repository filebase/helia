/* eslint-env mocha */
import * as dagPb from '@ipld/dag-pb';
import * as raw from 'multiformats/codecs/raw';
export function getCodec(code) {
    if (code === dagPb.code) {
        return dagPb;
    }
    if (code === raw.code) {
        return raw;
    }
    throw new Error(`Unknown codec ${code}`);
}
//# sourceMappingURL=get-codec.js.map