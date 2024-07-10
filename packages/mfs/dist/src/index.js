/**
 * @packageDocumentation
 *
 * `@helia/mfs` is an implementation of a {@link https://docs.ipfs.tech/concepts/file-systems/ Mutable File System} powered by {@link https://github.com/ipfs/helia Helia}.
 *
 * See the [API docs](https://ipfs.github.io/helia/modules/_helia_mfs.html) for all available operations.
 *
 * @example
 *
 * ```typescript
 * import { createHelia } from 'helia'
 * import { mfs } from '@helia/mfs'
 *
 * const helia = createHelia({
 *   // ... helia config
 * })
 * const fs = mfs(helia)
 *
 * // create an empty directory
 * await fs.mkdir('/my-directory')
 *
 * // add a file to the directory
 * await fs.writeBytes(Uint8Array.from([0, 1, 2, 3]), '/my-directory/foo.txt')
 *
 * // read the file
 * for await (const buf of fs.cat('/my-directory/foo.txt')) {
 *   console.info(buf)
 * }
 * ```
 */
import { unixfs } from '@helia/unixfs';
import { AlreadyExistsError, DoesNotExistError, InvalidParametersError, NotADirectoryError } from '@helia/unixfs/errors';
import { logger } from '@libp2p/logger';
import { Key } from 'interface-datastore';
import { UnixFS as IPFSUnixFS } from 'ipfs-unixfs';
import { CID } from 'multiformats/cid';
import { basename } from './utils/basename.js';
const log = logger('helia:mfs');
class DefaultMFS {
    components;
    unixfs;
    root;
    key;
    constructor(components, init = {}) {
        this.components = components;
        this.key = new Key(init.key ?? '/locals/filesroot');
        this.unixfs = unixfs(components);
    }
    async #getRootCID() {
        if (this.root == null) {
            try {
                const buf = await this.components.datastore.get(this.key);
                this.root = CID.decode(buf);
            }
            catch (err) {
                if (err.code !== 'ERR_NOT_FOUND') {
                    throw err;
                }
                this.root = await this.unixfs.addDirectory();
            }
        }
        return this.root;
    }
    async writeBytes(bytes, path, options) {
        const cid = await this.unixfs.addFile({
            content: bytes,
            mode: options?.mode,
            mtime: options?.mtime
        }, options);
        await this.cp(cid, path, options);
    }
    async writeByteStream(bytes, path, options) {
        const cid = await this.unixfs.addFile({
            content: bytes,
            mode: options?.mode,
            mtime: options?.mtime
        }, options);
        await this.cp(cid, path, options);
    }
    async *cat(path, options = {}) {
        const root = await this.#getRootCID();
        const trail = await this.#walkPath(root, path, {
            ...options,
            createMissingDirectories: false,
            finalSegmentMustBeDirectory: false
        });
        yield* this.unixfs.cat(trail[trail.length - 1].cid, options);
    }
    async chmod(path, mode, options = {}) {
        const root = await this.#getRootCID();
        this.root = await this.unixfs.chmod(root, mode, {
            ...options,
            path
        });
    }
    async cp(source, destination, options) {
        const root = await this.#getRootCID();
        const force = options?.force ?? false;
        if (typeof source === 'string') {
            const stat = await this.stat(source, options);
            source = stat.cid;
        }
        if (!force) {
            await this.#ensurePathDoesNotExist(destination, options);
        }
        const fileName = basename(destination);
        const containingDirectory = destination.substring(0, destination.length - `/${fileName}`.length);
        let trail = [{
                cid: root,
                name: ''
            }];
        if (containingDirectory !== '') {
            trail = await this.#walkPath(root, containingDirectory, {
                ...options,
                createMissingDirectories: options?.force ?? false,
                finalSegmentMustBeDirectory: true
            });
        }
        trail.push({
            cid: source,
            name: fileName
        });
        this.root = await this.#persistPath(trail, options);
    }
    async *ls(path, options) {
        const root = await this.#getRootCID();
        if (options?.path != null) {
            path = `${path}/${options.path}`;
        }
        yield* this.unixfs.ls(root, {
            ...options,
            path
        });
    }
    async mkdir(path, options) {
        const force = options?.force ?? false;
        if (!force) {
            await this.#ensurePathDoesNotExist(path, options);
        }
        const dirName = basename(path);
        const containingDirectory = path.substring(0, path.length - `/${dirName}`.length);
        const root = await this.#getRootCID();
        let trail = [{
                cid: root,
                name: ''
            }];
        if (containingDirectory !== '') {
            trail = await this.#walkPath(root, containingDirectory, {
                ...options,
                createMissingDirectories: force,
                finalSegmentMustBeDirectory: true
            });
        }
        trail.push({
            cid: await this.unixfs.addDirectory({
                mode: options?.mode,
                mtime: options?.mtime
            }, options),
            name: basename(path)
        });
        this.root = await this.#persistPath(trail, options);
    }
    async rm(path, options) {
        const force = options?.force ?? false;
        if (!force) {
            await this.#ensurePathExists(path, options);
        }
        const root = await this.#getRootCID();
        const trail = await this.#walkPath(root, path, {
            ...options,
            createMissingDirectories: false,
            finalSegmentMustBeDirectory: false
        });
        const lastSegment = trail.pop();
        if (lastSegment == null) {
            throw new InvalidParametersError('path was too short');
        }
        // remove directory entry
        const containingDir = trail[trail.length - 1];
        containingDir.cid = await this.unixfs.rm(containingDir.cid, lastSegment.name, options);
        this.root = await this.#persistPath(trail, options);
    }
    async stat(path, options) {
        const root = await this.#getRootCID();
        const trail = await this.#walkPath(root, path, {
            ...options,
            createMissingDirectories: false,
            finalSegmentMustBeDirectory: false
        });
        const finalEntry = trail.pop();
        if (finalEntry == null) {
            throw new DoesNotExistError();
        }
        return this.unixfs.stat(finalEntry.cid, {
            ...options
        });
    }
    async touch(path, options) {
        const root = await this.#getRootCID();
        const trail = await this.#walkPath(root, path, {
            ...options,
            createMissingDirectories: false,
            finalSegmentMustBeDirectory: false
        });
        const finalEntry = trail[trail.length - 1];
        if (finalEntry == null) {
            throw new DoesNotExistError();
        }
        finalEntry.cid = await this.unixfs.touch(finalEntry.cid, options);
        this.root = await this.#persistPath(trail, options);
    }
    async #walkPath(root, path, opts) {
        if (!path.startsWith('/')) {
            throw new InvalidParametersError('path must be absolute');
        }
        const stat = await this.unixfs.stat(root, {
            ...opts,
            offline: true
        });
        const output = [{
                cid: root,
                name: '',
                unixfs: stat.unixfs
            }];
        let cid = root;
        const parts = path.split('/').filter(Boolean);
        for (let i = 0; i < parts.length; i++) {
            const segment = parts[i];
            try {
                const stat = await this.unixfs.stat(cid, {
                    ...opts,
                    offline: true,
                    path: segment
                });
                output.push({
                    cid: stat.cid,
                    name: segment,
                    unixfs: stat.unixfs
                });
                cid = stat.cid;
            }
            catch (err) {
                log.error('could not resolve path segment %s of %s under %c', segment, path, root);
                if (opts.createMissingDirectories) {
                    const cid = await this.unixfs.addDirectory();
                    output.push({
                        cid,
                        name: segment,
                        unixfs: new IPFSUnixFS({ type: 'directory' })
                    });
                }
                else {
                    throw new DoesNotExistError(`${path} does not exist`);
                }
            }
        }
        const lastSegment = output[output.length - 1];
        if (opts.finalSegmentMustBeDirectory && lastSegment.unixfs?.isDirectory() !== true) {
            throw new NotADirectoryError(`${path} was not a directory`);
        }
        return output;
    }
    async #persistPath(path, options = {}) {
        let child = path.pop();
        if (child == null) {
            throw new InvalidParametersError('path was too short');
        }
        let cid = child.cid;
        for (let i = path.length - 1; i > -1; i--) {
            const segment = path[i];
            segment.cid = await this.unixfs.cp(child.cid, segment.cid, child.name, {
                ...options,
                force: true
            });
            child = segment;
            cid = segment.cid;
        }
        await this.components.datastore.put(this.key, cid.bytes, options);
        return cid;
    }
    async #ensurePathExists(path, options = {}) {
        const exists = await this.#pathExists(path, options);
        if (!exists) {
            throw new DoesNotExistError();
        }
    }
    async #ensurePathDoesNotExist(path, options = {}) {
        const exists = await this.#pathExists(path, options);
        if (exists) {
            throw new AlreadyExistsError();
        }
    }
    async #pathExists(path, options = {}) {
        try {
            await this.stat(path, {
                ...options,
                offline: true
            });
            return true;
        }
        catch {
            return false;
        }
    }
}
/**
 * Create a {@link MFS} instance powered by {@link https://github.com/ipfs/helia Helia}
 */
export function mfs(helia, init = {}) {
    return new DefaultMFS(helia, init);
}
//# sourceMappingURL=index.js.map