import type { HeliaLibp2p } from 'helia';
import type { KuboNode } from 'ipfsd-ctl';
/**
 * Connect the two nodes by dialing a protocol stream
 */
export declare function connect(helia: HeliaLibp2p<any>, kubo: KuboNode, protocol: string): Promise<void>;
//# sourceMappingURL=connect.d.ts.map