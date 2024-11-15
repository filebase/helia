import { CarWriter } from '@ipld/car';
import toBuffer from 'it-to-buffer';
import defer from 'p-defer';
export function memoryCarWriter(root) {
    const deferred = defer();
    const { writer, out } = CarWriter.create(Array.isArray(root) ? root : [root]);
    Promise.resolve()
        .then(async () => {
        deferred.resolve(await toBuffer(out));
    })
        .catch(err => {
        deferred.reject(err);
    });
    return {
        async put(block) {
            await writer.put(block);
        },
        async close() {
            await writer.close();
        },
        async bytes() {
            return deferred.promise;
        }
    };
}
//# sourceMappingURL=memory-car.js.map