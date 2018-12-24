// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { i32, u32, i54, fract32, fract53 } from "../util/number"
import { stringAsUint8Array } from "../util/string-encoding"
import {
    asU32, asFract32, asU32Between, asI32Between, asI54, asFract53
} from "../util/number-conversion"

/**
 * Common low-level interface for PRNG.
 * The generic type corresponds to the generator state's type.
 */
export interface MutRandom <S> {
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

// Duplication
    /**
     * @param n maximum number of atomic generations that can be performed on
     *  the copy without modifying the original (g)
     * @return (partial) duplica of g
     */
    readonly smartCopy: (this: void, g: Readonly<S>, n: u32) => S

// Guard
    /**
     * @param x candidate to test
     * @return Is `x' a valid generator state?
     */
    readonly isValid: (this: void, x: unknown) => x is S

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
}

export type Fract32MutRandom <S> = Pick<MutRandom<S>,
    "nextFract32" | "smartCopy" | "fromUint8Array" | "isValid">

export type U32BMutRandom <S> = Pick<MutRandom<S>,
    "nextU32" | "smartCopy" | "fromUint8Array" | "isValid">

export function mutRandomFrom <S>
    (partMutRand: Fract32MutRandom<S> | U32BMutRandom<S>): MutRandom<S> {

    let nextU32: MutRandom<S>["nextU32"]
    let nextFract32: MutRandom<S>["nextFract32"]
    if ("nextU32" in partMutRand) {
        nextU32 = partMutRand.nextU32
        nextFract32 = function (this: S): fract32 {
            return asFract32(nextU32.call(this))
        }
    } else {
        nextFract32 = partMutRand.nextFract32
        nextU32 = function (this: S): u32 {
            return asU32(nextFract32.call(this))
        }
    }

    const { fromUint8Array, isValid, smartCopy } = partMutRand
    return {
        fromUint8Array, isValid, smartCopy,
        nextU32, nextFract32,

        from: (seed) => fromUint8Array(stringAsUint8Array(seed)),

        nextU32Between (l, exclusiveU) {
            return asU32Between(l, exclusiveU, nextFract32.call(this))
        },

        nextI32Between (l, exclusiveU) {
            return asI32Between(l, exclusiveU, nextFract32.call(this))
        },

        nextI54 () {
            return asI54(nextFract32.call(this), nextU32.call(this))
        },

        nextFract53 () {
            return asFract53(nextU32.call(this), nextFract32.call(this))
        }
    }
}
