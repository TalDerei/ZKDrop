export declare function MiMCSponge(left: string, right: string): string;
export interface IMerkleTree {
    root: () => string;
    proof: (index: number) => {
        root: string;
        pathElements: string[];
        pathIndices: number[];
        leaf: string;
    };
    insert: (leaf: string) => void;
}
export declare class MerkleTree implements IMerkleTree {
    readonly zeroValue = "21663839004416932945382355908790599225266501822907911457504978515578255421292";
    levels: number;
    hashLeftRight: (left: string, right: string) => string;
    storage: Map<string, string>;
    zeros: string[];
    totalLeaves: number;
    constructor(levels: number, defaultLeaves?: string[], hashLeftRight?: typeof MiMCSponge);
    static indexToKey(level: number, index: number): string;
    getIndex(leaf: string): number;
    root(): string;
    proof(indexOfLeaf: number): {
        root: string;
        pathElements: string[];
        pathIndices: number[];
        leaf: string;
    };
    insert(leaf: string): void;
    update(index: number, newLeaf: string, isInsert?: boolean): void;
    private traverse;
}
