// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { i32, u32, i54, fract32, fract53, U32_TOP } from "../util/number"
import { MutRandom } from "./mut-random"
import { RandomStream } from "./random-stream"

/**
 * Common interface for seeded random generators.
 * The generic type corresponds to the generator state's type.
 */
export interface Random <S> {
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

// Guard
    /**
     * @param x candidate to test
     * @return Is `x' a valid generator state?
     */
    readonly isValid: (this: void, x: unknown) => x is Readonly<S>

// Stream factory
    /**
     * @param seed
     * @return Random generator using seed to produce deterministic randoms
     */
    readonly streamFrom: (this: void, seed: string) => RandomStream

    /**
     * @param state generator state
     * @return Random generator using an existing generator's state
     */
    readonly streamFromState: (this: void, state: Readonly<S>) => RandomStream

// Random generation
    /**
     * @param g generator state
     * @return a random unsigned integer (32bits), and next generator state
     */
    readonly u32: (this: void, g: Readonly<S>) => [u32, Readonly<S>]

    /**
     * @param g generator state
     * @return a random safe integer (54bits), and next generator state
     */
    readonly i54: (this: void, g: Readonly<S>) => [i54, Readonly<S>]

    /**
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @param g generator state
     * @return a random unsigned integer (32bits) in interval [l, exclusiveU[,
     *      and next generator state
     */
    readonly u32Between: (this: void, l: u32, exclusiveU: u32) =>
        (this: void, g: Readonly<S>) => [u32, Readonly<S>]

    /**
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @param g generator state
     * @return a random integer (32bits) in interval [l, exclusiveU[,
     *      and next generator state
     */
    readonly i32Between: (this: void, l: i32, exclusiveU: i32) =>
        (this: void, g: Readonly<S>) => [i32, Readonly<S>]

    /**
     * @param g generator state
     * @return a random float in interval [0, 1[ using 32 significant bits,
     *      and next generator state
     */
    readonly fract32: (this: void, g: Readonly<S>) => [fract32, Readonly<S>]

    /**
     * @param g generator state
     * @return a random float in interval [0, 1[ using 53 significant bits,
     *      and a new generator state
     */
    readonly fract53: (this: void, g: Readonly<S>) => [fract53, Readonly<S>]
}

/**
 * @param proto
 * @return new object using proto as prototype.
 */
const prototypeFrom: <T extends object> (proto: T) => T = Object.create

export function randomFrom <S> (mutRand: MutRandom<S>): Random<S> {
    const {
        fromUint8Array, from, smartCopy, isValid,
        nextU32, nextI54, nextU32Between, nextI32Between,
        nextFract32, nextFract53
    } = mutRand
    return {
        fromUint8Array, from, isValid,

        streamFrom: (seed) => Object.assign(prototypeFrom(mutRand), from(seed)),

        streamFromState: (state) =>
            Object.assign(prototypeFrom(mutRand), smartCopy(state, U32_TOP)),
                // deeply copy state to protect internal state

        u32: (g) => {
            const copied = smartCopy(g, 1)
            return [nextU32.call(copied), copied]
        },

        fract32: (g) => {
            const copied = smartCopy(g, 1)
            return [nextFract32.call(copied), copied]
        },

        u32Between: (l, exclusiveU) => (g) => {
            const copied = smartCopy(g, 1)
            return [nextU32Between.call(copied, l, exclusiveU), copied]
        },

        i32Between: (l, exclusiveU) => (g) => {
            const copied = smartCopy(g, 1)
            return [nextI32Between.call(copied, l, exclusiveU), copied]
        },

        i54: (g) => {
            const copied = smartCopy(g, 2)
            return [nextI54.call(copied), copied]
        },

        fract53: (g) => {
            const copied = smartCopy(g, 2)
            return [nextFract53.call(copied), copied]
        },
    }
}
