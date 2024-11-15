/* eslint-env mocha */
import { ipns } from '@helia/ipns';
import { expect } from 'aegir/chai';
import { createHeliaNode } from './fixtures/create-helia.js';
const TEST_DOMAINS = [
    'ipfs.tech',
    'docs.ipfs.tech',
    'en.wikipedia-on-ipfs.org'
];
describe('@helia/ipns - dnslink', () => {
    let helia;
    let name;
    beforeEach(async () => {
        helia = await createHeliaNode();
        name = ipns(helia);
    });
    afterEach(async () => {
        if (helia != null) {
            await helia.stop();
        }
    });
    TEST_DOMAINS.forEach(domain => {
        it(`should resolve ${domain}`, async () => {
            const result = await name.resolveDNSLink(domain);
            expect(result).to.have.property('cid');
        }).retries(5);
    });
});
//# sourceMappingURL=ipns-dnslink.spec.js.map