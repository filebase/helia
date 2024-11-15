import type { Libp2p } from '@libp2p/interface';
import type { DefaultLibp2pServices, HeliaLibp2p } from 'helia';
import type { Libp2pOptions } from 'libp2p';
export declare function createHeliaNode(): Promise<HeliaLibp2p<Libp2p<DefaultLibp2pServices>>>;
export declare function createHeliaNode<Services extends Record<string, unknown>>(libp2pOptions: Libp2pOptions<Services>): Promise<HeliaLibp2p<Libp2p<Services & DefaultLibp2pServices>>>;
//# sourceMappingURL=create-helia.browser.d.ts.map