// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { isObject } from "./data-validation"

/**
 * Read-only typed or untyped array.
 */
export interface ReadonlyTypeableArray<E> {
    // Access
    /**
     * @param index Zero-based index of the item to retrieve
     * @return Item attached to `n'.
     */
    readonly [index: number]: E

    /**
     * Count of elements.
     */
    readonly length: number

    // Iterator
    /**
     * @return (key, value) pairs for every entry in the array.
     */
    entries(): IterableIterator<[number, E]>

    /**
     * @return Keys of the array.
     */
    keys(): IterableIterator<number>

    /**
     * @return Values of the array.
     */
    values(): IterableIterator<E>

    /**
     * Same than this.values()
     */
    [Symbol.iterator](): IterableIterator<E>

    // Logic
    /**
     * @param pred prdicate to test on the items
     * @param target Value to use as this when calling `pred'
     * @return Is `pred' satisfied by all items?
     */
    every(
        pred: (
            this: void,
            item: E,
            index: number,
            array: ReadonlyTypeableArray<E>
        ) => boolean,
        target?: undefined
    ): boolean
    every<Z>(
        pred: (
            this: Z,
            item: E,
            index: number,
            array: ReadonlyTypeableArray<E>
        ) => boolean,
        target: Z
    ): boolean

    /**
     * @param pred prdicate to test on the items
     * @param target Value to use as this when calling `pred'
     * @return Is `pred' satisfied by atleast one item?
     */
    some(
        pred: (
            this: void,
            item: E,
            i: number,
            array: ReadonlyTypeableArray<E>
        ) => boolean,
        target?: undefined
    ): boolean
    some<Z>(
        pred: (
            this: Z,
            item: E,
            i: number,
            array: ReadonlyTypeableArray<E>
        ) => boolean,
        target: Z
    ): boolean

    // Loop
    /**
     * @param consumer Function to run for each item.
     * @param target Value to use as this when calling `consumer'.
     */
    forEach(
        consumer: (
            this: void,
            item: E,
            index: number,
            array: ReadonlyTypeableArray<E>
        ) => void,
        target?: undefined
    ): void
    forEach<Z>(
        consumer: (
            this: Z,
            item: E,
            index: number,
            array: ReadonlyTypeableArray<E>
        ) => void,
        target: Z
    ): void

    // Searching
    /**
     * @param pred Function to run on each value in the array
     * @param target Value to use as this when calling `pred'.
     * @return An item that satisfies `pred' or undefined if none.
     */
    find(
        pred: (
            this: void,
            item: E,
            index: number,
            array: ReadonlyTypeableArray<E>
        ) => boolean,
        target?: undefined
    ): E | undefined
    find<Z>(
        pred: (
            this: Z,
            item: E,
            index: number,
            array: ReadonlyTypeableArray<E>
        ) => boolean,
        target: Z
    ): E | undefined

    /**
     * @param pred Function to run on each value in the array
     * @param target Value to use as this when calling `pred'.
     * @return Index of an item that satisfies `pred' or -1 if none.
     */
    findIndex(
        pred: (this: void, item: E) => boolean,
        target?: undefined
    ): number
    findIndex<Z>(this: Z, pred: (item: E) => boolean, target: Z): number

    /**
     * @param item
     *     Element to locate.
     * @param fromIndex
     *     Zero-based index at which to start searching forwards.
     *     As a negative index; it indicates an offset from the end.
     *     Default: 0
     * @return Index of `item' or `-1' if not found.
     */
    indexOf(item: E, fromIndex?: number): number

    /**
     * @param item
     *     Element to locate.
     * @param fromIndex
     *     Zero-based index at which to start searching backwards.
     *     As a negative index; it indicates an offset from the start.
     *     Default: this.length - 1
     * @return Index of `item' or `-1' if not found.
     */
    lastIndexOf(item: E, fromIndex?: number): number

    // Transformation and filtering
    /**
     * @param pred Function to test each element of the array.
     * @param target Value to use as this when calling `pred'.
     * @return New array with all items satisfying `pred'.
     */
    filter(
        pred: (
            this: void,
            item: E,
            i: number,
            array: ReadonlyTypeableArray<E>
        ) => boolean,
        target?: undefined
    ): TypeableArray<E>
    filter<Z>(
        pred: (
            this: Z,
            item: E,
            i: number,
            array: ReadonlyTypeableArray<E>
        ) => boolean,
        target: Z
    ): TypeableArray<E>

    /**
     * @param separator
     *     String to separate each element of the array.
     *     Default: ','
     * @return Concatenation of all items of this.
     */
    join(separator?: string): string

    /**
     * @param producer Function that produces an item of the new array.
     * @param target Value to use as this when calling `producer'.
     * @return New array mapping each item with `producer'.
     */
    map<U>(
        producer: (
            this: void,
            item: E,
            i: number,
            array: ReadonlyTypeableArray<E>
        ) => U,
        target?: undefined
    ): TypeableArray<U>
    map<U, Z>(
        producer: (
            this: Z,
            item: E,
            i: number,
            array: ReadonlyTypeableArray<E>
        ) => U,
        target: Z
    ): TypeableArray<U>

    /**
     * @param reducer Function to run for each item.
     * @param initial Intial value for `aPrev' in thefirst call to `reducer'.
     * @return Result of the reduction of the entire array.
     */
    reduce(
        reducer: (
            aPrev: E,
            item: E,
            i: number,
            array: ReadonlyTypeableArray<E>
        ) => E,
        initial?: E
    ): E

    /**
     * @param reducer Function to run for each item.
     * @param initial Intial value for `aPrev' in thefirst call to `reducer'.
     * @return Result of the reduction of the entire array.
     */
    reduce<U>(
        reducer: (
            aPrev: U,
            item: E,
            i: number,
            array: ReadonlyTypeableArray<E>
        ) => U,
        initial: U
    ): U

    /**
     * @param reducer Function to run for each item.
     * @param initial Intial value for `aPrev' in thefirst call to `reducer'.
     * @return Result of the backwards reduction of the entire array.
     */
    reduceRight(
        reducer: (
            aPrev: E,
            item: E,
            i: number,
            array: ReadonlyTypeableArray<E>
        ) => E,
        initial?: E
    ): E

    /**
     * @param reducer Function to run for each item.
     * @param initial Intial value for `aPrev' in thefirst call to `reducer'.
     * @return Result of the backwards reduction of the entire array.
     */
    reduceRight<U>(
        reducer: (
            aPrev: U,
            item: E,
            i: number,
            array: ReadonlyTypeableArray<E>
        ) => U,
        initial: U
    ): U

    /**
     * @param start
     *     Zero-based index at which to begin the slice.
     *     As a negative index; it indicates an offset from the end.
     *     Default: 0
     * @param end
     *     Zero-based index at which to end the slice.
     *     As a negative index; it indicates an offset from the end.
     *     Default: this.length - 1
     * @return New array from `start' until `end'.
     */
    slice(start?: number, end?: number): TypeableArray<E>
}

/**
 * Mutable typed or untyped array
 */
export interface TypeableArray<E> extends ReadonlyTypeableArray<E> {
    /**
     * WARNING: Assigment above this.length has no effect on typed arrays.
     * @param n Zero-based index of the item to retrieve
     * @return Item attached to `n'.
     */
    [n: number]: E

    /**
     * Mutation: Replace items from `target' with values
     *     from `start' until `end'.
     * @param target
     *     Zero-based index at which to copy the slice start .. end.
     *     As a negative index; it indicates an offset from the end.
     * @param start
     *     Zero-based index at which to start copying item from.
     *     As a negative index; it indicates an offset from the end.
     *     Default: 0
     * @param end
     *     Zero-based index at which to end copying item from.
     *     As a negative index; it indicates an offset from the end.
     *     Default: this.length - 1
     * @param this
     */
    copyWithin(target: number, start: number, end?: number): this

    /**
     * Mutation: Replace items from `start' until `end' with `item'.
     * @param item
     * @param start
     *     Zero-based index at which to start replacing.
     *     As a negative index; it indicates an offset from the end.
     *     Default: 0
     * @param end
     *     Zero-based index at which to end replacing.
     *     As a negative index; it indicates an offset from the end.
     *     Default: this.length - 1
     * @return this
     */
    fill(item: E, start?: number, end?: number): this

    /**
     * Mutation: Reverse the order of the items.
     * @return this
     */
    reverse(): this

    /**
     * Mutation: Sort the array
     * @param a3wayComparator Three-way-comparator.
     * @return this
     */
    sort(a3wayComparator?: (a: E, b: E) => number): this
}

/**
 * Typed or untyped array factory
 */
export interface TypeableArrayFactory<E, T extends TypeableArray<E>> {
    new (aLength: number): T

    /**
     * @param ref An array-like object to convert to an array.
     * @param converter A mapping function to call on all tems of the array.
     * @param target Value used as this to call `converter'.
     * @return New array from `ref'.
     */
    from<U>(
        ref: Iterable<U>,
        converter: (this: void, v: U, k: number) => E,
        atarget?: undefined
    ): T
    from<U, Z>(
        ref: Iterable<U>,
        converter: (this: Z, v: U, k: number) => E,
        atarget: Z
    ): T

    /**
     * @param ref An array-like object to convert to an array.
     * @return New array from `ref'.
     */
    from(ref: Iterable<E>): T

    /**
     * @param items Set of items to include.
     * @return New array from `items'.
     */
    of(...items: E[]): T

    readonly prototype: T
}

/**
 * Typed or untyped array constructor
 */
export type TypeableArrayConstructor<E> = TypeableArrayFactory<
    E,
    TypeableArray<E>
>

/**
 * @internal
 *
 * Construct a typed / untyped array from a typed / untyped array, or an object
 * with index as properties. This last case is useful to recover a
 * typed array from its JSON representation.
 *
 * @param x
 * @param factory
 * @param itemGuard
 * @return typed array from `x'
 */
export function arayFrom<T extends TypeableArray<number>>(
    x: { [i: number]: unknown },
    factory: TypeableArrayFactory<number, T>,
    itemGuard: (y: unknown) => y is number
): T {
    if (
        (Array.isArray(x) ||
            x instanceof Uint8ClampedArray ||
            x instanceof Uint8Array ||
            x instanceof Uint16Array ||
            x instanceof Uint32Array ||
            x instanceof Int8Array ||
            x instanceof Int16Array ||
            x instanceof Int32Array ||
            x instanceof Float32Array ||
            x instanceof Float64Array) &&
        (x as TypeableArray<number>).every(itemGuard)
    ) {
        return factory.from(x)
    } else {
        const array: number[] = []
        let i = 0
        let e = x[i]
        while (itemGuard(e)) {
            array[i] = e
            i++
            e = x[i]
        }
        return factory.from(array)
    }
}
