export declare class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    add(v: Vector2): this;
    addVectors(a: Vector2, b: Vector2): this;
    multiplyScalar(scalar: number): this;
}
