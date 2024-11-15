import { createHeliaHTTP as createHelia } from '@helia/http';
export async function createHeliaHTTP(init = {}) {
    return createHelia({
        ...init
    });
}
//# sourceMappingURL=create-helia-http.js.map