
<<<<<<< HEAD
interface Uint8ClampedArray extends ArrayBuffer {
=======
interface Uint8ClampedArray extends ArrayBufferView {
>>>>>>> df6a4993ab08a2d0aed6d09d477209f5477a0fe3
    BYTES_PER_ELEMENT: number;
    length: number;
    [index: number]: number;
    get(index: number): number;
    set(index: number, value: number): void;
<<<<<<< HEAD
    set(array: Uint8ClampedArray, offset?: number): void;
    set(array: number[], offset?: number): void;
    subarray(begin: number, end?: number): Uint8ClampedArray;
=======
    set(array: Uint8Array, offset?: number): void;
    set(array: number[], offset?: number): void;
    subarray(begin: number, end?: number): Uint8Array;
>>>>>>> df6a4993ab08a2d0aed6d09d477209f5477a0fe3
}

declare var Uint8ClampedArray: {
    prototype: Uint8ClampedArray;
    new (length: number): Uint8ClampedArray;
    new (array: Uint8Array): Uint8ClampedArray;
    new (array: number[]): Uint8ClampedArray;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint8ClampedArray;
    BYTES_PER_ELEMENT: number;
}

