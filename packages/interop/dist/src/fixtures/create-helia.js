import { bitswap } from '@helia/block-brokers';
import { ipnsValidator, ipnsSelector } from '@helia/ipns';
import { kadDHT, removePublicAddressesMapper } from '@libp2p/kad-dht';
import { sha3512 } from '@multiformats/sha3';
import { createHelia, libp2pDefaults } from 'helia';
export async function createHeliaNode(libp2pOptions) {
    const defaults = libp2pDefaults();
    defaults.addresses = {
        listen: [
            '/ip4/0.0.0.0/tcp/0'
        ]
    };
    defaults.services = {
        ...(defaults.services ?? {}),
        ...(libp2pOptions?.services ?? {}),
        dht: kadDHT({
            validators: {
                ipns: ipnsValidator
            },
            selectors: {
                ipns: ipnsSelector
            },
            protocol: '/ipfs/lan/kad/1.0.0',
            peerInfoMapper: removePublicAddressesMapper,
            clientMode: false
        })
    };
    // remove bootstrappers, mdns, etc
    defaults.peerDiscovery = [];
    // remove services that are not used in tests
    // @ts-expect-error services.autoNAT is not optional
    delete defaults.services.autoNAT;
    // @ts-expect-error services.dcutr is not optional
    delete defaults.services.dcutr;
    // @ts-expect-error services.delegatedRouting is not optional
    delete defaults.services.delegatedRouting;
    return createHelia({
        blockBrokers: [
            bitswap()
        ],
        libp2p: defaults,
        hashers: [
            sha3512
        ]
    });
}
//# sourceMappingURL=create-helia.js.map