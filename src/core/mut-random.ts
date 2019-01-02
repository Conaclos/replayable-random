// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { fract32, fract53, i32, i54, u32 } from "../util/number"
import {
    asFract32,
    asFract53,
    asI32Between,
    asI54,
    asU32,
    asU32Between,
} from "../util/number-conversion"
import { stringAsUint8Array } from "../util/string-encoding"

/**
 * Common low-level interface for PRNG.
 * The generic type corresponds to the generator state's type.
 */
export interface MutRandom<S> {
    // State derivator
    /**
     * @param seed
     * @return generator state using seed to produce deterministic generations
     */
    readonly from: (this: void, seed: string) => Readonly<S>

    /**
     * @param seed
     * @return generator state using seed to produce deterministic generations
     */
    readonly fromUint8Array: (this: void, seed: Uint8Array) => Readonly<S>

    /**
     * @param x
     * @return generator's state from `x', or undefined if `x' is not valid.
     */
    readonly fromPlain: (this: void, x: unknown) => Readonly<S> | undefined

    // Duplication
    /**
     * @param n maximum number of atomic generations that can be performed on
     *  the copy without modifying the original (g)
     * @return (partial) duplica of g
     */
    readonly smartCopy: (this: void, g: Readonly<S>, n: u32) => S

    // Random generation
    /**
     * Atomic generation: 1
     * @return a random unsigned integer (32bits)
     */
    readonly nextU32: (this: S) => u32

    /**
     * Atomic generation: 2
     * @return a random safe integer (54bits)
     */
    readonly nextI54: (this: S) => i54

    /**
     * Atomic generation: 1
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @return a random unsigned integer (32bits) in interval [l, exclusiveU[
     */
    readonly nextU32Between: (this: S, l: u32, exclusiveU: u32) => u32

    /**
     * Atomic generation: 1
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @return a random integer (32bits) in interval [l, exclusiveU[
     */
    readonly nextI32Between: (this: S, l: i32, exclusiveU: i32) => i32

    /**
     * Atomic generation: 1
     * @return a random float in interval [0, 1[ using 32 significant bits
     */
    readonly nextFract32: (this: S) => fract32

    /**
     * Atomic generation: 2
     * @return a random float in interval [0, 1[ using 53 significant bits
     */
    readonly nextFract53: (this: S) => fract53

    /**
     * Atomic generation: (n + 3) / 4 >>> 0
     * @param n number of generated unsigned integer (8bits)
     * @return array that contains a number of n unsigned integer (8bits)
     */
    readonly nextU8Array: (this: S, n: u32) => Uint8Array

    /**
     * Atomic generation: n
     * @param n number of generated unsigned integer (32bits)
     * @return array that contains a number of n unsigned integer (32bits)
     */
    readonly nextU32Array: (this: S, n: u32) => Uint32Array
}

export type Fract32MutRandom<S> = Pick<
    MutRandom<S>,
    "nextFract32" | "smartCopy" | "fromUint8Array" | "fromPlain"
>

export type U32BMutRandom<S> = Pick<
    MutRandom<S>,
    "nextU32" | "smartCopy" | "fromUint8Array" | "fromPlain"
>

export function mutRandomFrom<S>(
    partMutRand: Fract32MutRandom<S> | U32BMutRandom<S>
): MutRandom<S> {
    let nextU32: MutRandom<S>["nextU32"]
    let nextFract32: MutRandom<S>["nextFract32"]
    if ("nextU32" in partMutRand) {
        nextU32 = partMutRand.nextU32
        nextFract32 = function(this: S): fract32 {
            return asFract32(nextU32.call(this))
        }
    } else {
        nextFract32 = partMutRand.nextFract32
        nextU32 = function(this: S): u32 {
            return asU32(nextFract32.call(this))
        }
    }

    const nextU32Array = function(this: S, n: u32): Uint32Array {
        const result = new Uint32Array(n)
        for (let i = 0; i < n; i++) {
            result[i] = nextU32.call(this)
        }
        return result
    }

    const nextU8Array = function(this: S, n: u32): Uint8Array {
        const u32Count = ((n + 3) / 4) >>> 0
        const u32Array = nextU32Array.call(this, u32Count)
        return new Uint8Array(u32Array.buffer)
    }

    const { fromUint8Array, fromPlain, smartCopy } = partMutRand
    return {
        fromUint8Array,
        fromPlain,
        smartCopy,
        nextU32,
        nextFract32,
        nextU32Array,
        nextU8Array,

        from: (seed) => fromUint8Array(stringAsUint8Array(seed)),

        nextU32Between(l, exclusiveU) {
            return asU32Between(l, exclusiveU, nextFract32.call(this))
        },

        nextI32Between(l, exclusiveU) {
            return asI32Between(l, exclusiveU, nextFract32.call(this))
        },

        nextI54() {
            return asI54(nextFract32.call(this), nextU32.call(this))
        },

        nextFract53() {
            return asFract53(nextU32.call(this), nextFract32.call(this))
        },
    }
}
