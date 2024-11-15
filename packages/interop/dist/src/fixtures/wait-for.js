export async function waitFor(fn, options) {
    const delay = options.delay ?? 100;
    const timeoutAt = Date.now() + options.timeout;
    while (true) {
        const result = await fn();
        if (result) {
            return;
        }
        await new Promise((resolve) => {
            setTimeout(() => { resolve(); }, delay);
        });
        if (Date.now() > timeoutAt) {
            throw new Error(options.message ?? 'WaitFor timed out');
        }
    }
}
//# sourceMappingURL=wait-for.js.map