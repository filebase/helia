import { CarWriter } from '@ipld/car';
import type { CID } from 'multiformats/cid';
export interface MemoryCar extends Pick<CarWriter, 'put' | 'close'> {
    bytes(): Promise<Uint8Array>;
}
export declare function memoryCarWriter(root: CID | CID[]): MemoryCar;
//# sourceMappingURL=memory-car.d.ts.map