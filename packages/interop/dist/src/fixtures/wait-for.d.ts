export interface WaitForOptions {
    timeout: number;
    delay?: number;
    message?: string;
}
export declare function waitFor(fn: () => Promise<boolean>, options: WaitForOptions): Promise<void>;
//# sourceMappingURL=wait-for.d.ts.map