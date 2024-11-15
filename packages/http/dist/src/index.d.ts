/**
 * @packageDocumentation
 *
 * Exports a `createHeliaHTTP` function that returns an object that implements a lightweight version of the {@link Helia} API that functions only over HTTP.
 *
 * By default, content and peer routing are requests are resolved using the [Delegated HTTP Routing API](https://specs.ipfs.tech/routing/http-routing-v1/) and blocks are fetched from [Trustless Gateways](https://specs.ipfs.tech/http-gateways/trustless-gateway/).
 *
 * Pass it to other modules like {@link https://www.npmjs.com/package/@helia/unixfs | @helia/unixfs} to fetch files from the distributed web.
 *
 * @example
 *
 * ```typescript
 * import { createHeliaHTTP } from '@helia/http'
 * import { unixfs } from '@helia/unixfs'
 * import { CID } from 'multiformats/cid'
 *
 * const helia = await createHeliaHTTP()
 *
 * const fs = unixfs(helia)
 * fs.cat(CID.parse('bafyFoo'))
 * ```
 * @example with custom gateways and delegated routing endpoints
 * ```typescript
 * import { createHeliaHTTP } from '@helia/http'
 * import { trustlessGateway } from '@helia/block-brokers'
 * import { delegatedHTTPRouting, httpGatewayRouting } from '@helia/routers'
 * import { unixfs } from '@helia/unixfs'
 * import { CID } from 'multiformats/cid'
 *
 * const helia = await createHeliaHTTP({
 *   blockBrokers: [
 *     trustlessGateway()
 *   ],
 *   routers: [
 *     delegatedHTTPRouting('https://delegated-ipfs.dev'),
 *     httpGatewayRouting({
 *       gateways: ['https://cloudflare-ipfs.com', 'https://ipfs.io']
 *     })
 *   ]
 * })
 *
 * const fs = unixfs(helia)
 * fs.cat(CID.parse('bafyFoo'))
 * ```
 */
import { type HeliaInit } from '@helia/utils';
import type { Helia } from '@helia/interface';
export * from '@helia/interface';
export interface HeliaHTTPInit extends HeliaInit {
    /**
     * Whether to start the Helia node
     */
    start?: boolean;
}
/**
 * Create and return a Helia node
 */
export declare function createHeliaHTTP(init?: Partial<HeliaHTTPInit>): Promise<Helia>;
//# sourceMappingURL=index.d.ts.map