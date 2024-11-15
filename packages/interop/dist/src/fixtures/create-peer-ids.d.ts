import type { PeerId } from '@libp2p/interface';
/**
 * Sort peers by distance to the KadID of the passed buffer
 */
export declare function sortClosestPeers(buf: Uint8Array, peers: PeerId[]): Promise<PeerId[]>;
/**
 * Creates a DHT ID by hashing a Peer ID
 */
export declare function convertPeerId(peerId: PeerId): Promise<Uint8Array>;
/**
 * Creates a DHT ID by hashing a given Uint8Array
 */
export declare function convertBuffer(buf: Uint8Array): Promise<Uint8Array>;
//# sourceMappingURL=create-peer-ids.d.ts.map