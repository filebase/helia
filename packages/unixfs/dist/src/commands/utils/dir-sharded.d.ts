import { Bucket, type BucketChild } from 'hamt-sharding';
import { UnixFS } from 'ipfs-unixfs';
import { CID } from 'multiformats/cid';
import { type PersistOptions } from './persist.js';
import type { PutStore } from '../../unixfs.js';
import type { Mtime } from 'ipfs-unixfs';
interface InProgressImportResult extends ImportResult {
    single?: boolean;
    originalPath?: string;
}
interface ImportResult {
    cid: CID;
    size: bigint;
    path?: string;
    unixfs?: UnixFS;
}
interface DirProps {
    root: boolean;
    dir: boolean;
    path: string;
    dirty: boolean;
    flat: boolean;
    parent?: Dir;
    parentKey?: string;
    unixfs?: UnixFS;
    mode?: number;
    mtime?: Mtime;
}
declare abstract class Dir {
    options: PersistOptions;
    root: boolean;
    dir: boolean;
    path: string;
    dirty: boolean;
    flat: boolean;
    parent?: Dir;
    parentKey?: string;
    unixfs?: UnixFS;
    mode?: number;
    mtime?: Mtime;
    cid?: CID;
    size?: number;
    nodeSize?: number;
    constructor(props: DirProps, options: PersistOptions);
    abstract put(name: string, value: InProgressImportResult | Dir): Promise<void>;
    abstract get(name: string): Promise<InProgressImportResult | Dir | undefined>;
    abstract eachChildSeries(): AsyncIterable<{
        key: string;
        child: InProgressImportResult | Dir;
    }>;
    abstract flush(blockstore: PutStore): AsyncGenerator<ImportResult>;
    abstract estimateNodeSize(): number;
    abstract childCount(): number;
}
export declare class DirSharded extends Dir {
    _bucket: Bucket<InProgressImportResult | Dir>;
    constructor(props: DirProps, options: PersistOptions);
    put(name: string, value: InProgressImportResult | Dir): Promise<void>;
    get(name: string): Promise<InProgressImportResult | Dir | undefined>;
    childCount(): number;
    directChildrenCount(): number;
    onlyChild(): Bucket<InProgressImportResult | Dir> | BucketChild<InProgressImportResult | Dir>;
    eachChildSeries(): AsyncGenerator<{
        key: string;
        child: InProgressImportResult | Dir;
    }>;
    estimateNodeSize(): number;
    flush(blockstore: PutStore): AsyncGenerator<ImportResult>;
}
export declare const CID_V0: CID<unknown, number, number, import("multiformats/cid").Version>;
export declare const CID_V1: CID<unknown, number, number, import("multiformats/cid").Version>;
export {};
//# sourceMappingURL=dir-sharded.d.ts.map