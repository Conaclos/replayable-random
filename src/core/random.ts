// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { i32, u32, i54, fract32, fract53, U32_TOP } from "../util/number"
import { MutRandom, Fract32BasedMutRandom, U32BasedMutRandom, mutRandomFrom } from "./mut-random"
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
    readonly isValid: (this: void, x: unknown) => x is S

// Stream factory
    /**
     * @param seed
     * @return Random generator using seed to produce deterministic randoms
     */
    readonly streamFrom: (this: void, seed: string) => RandomStream<S>

    /**
     * @param state generator state
     * @return Random generator using an existing generator's state
     */
    readonly streamFromState: (this: void, state: Readonly<S>) => RandomStream<S>

    /**
     * @param seed
     * @return Random generator using seed to produce deterministic randoms
     */
    readonly streamFromUint8Array: (this: void, seed: Uint8Array) => RandomStream<S>

    /**
     * @param x
     * @return Random generator from `x', or undefined if `x' is not valid.
     */
    readonly streamFromPlain: (this: void, x: unknown) => RandomStream<S> | undefined

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

function randomFromMut <S> (mutRand: MutRandom<S>): Random<S> {
    const { fromUint8Array, from, smartCopy, isValid, mutU32, mutI54, mutU32Between, mutI32Between, mutFract32, mutFract53 } = mutRand
    return {
        fromUint8Array, from, isValid,

        streamFrom: (seed) =>
            new RandomStream(from(seed), mutRand),

        streamFromState: (state) => // deeply copy state to protect internal state
            new RandomStream(smartCopy(state, U32_TOP), mutRand),

        streamFromUint8Array: (seed) =>
            new RandomStream(fromUint8Array(seed), mutRand),

        streamFromPlain: (x) => RandomStream.fromPlain(x, mutRand),

        u32: (g) => {
            const copied = smartCopy(g, 1)
            return [mutU32(copied), copied]
        },

        fract32: (g) => {
            const copied = smartCopy(g, 1)
            return [mutFract32(copied), copied]
        },

        u32Between: (l, exclusiveU) => (g) => {
            const copied = smartCopy(g, 1)
            return [mutU32Between(l, exclusiveU, copied), copied]
        },

        i32Between: (l, exclusiveU) => (g) => {
            const copied = smartCopy(g, 1)
            return [mutI32Between(l, exclusiveU, copied), copied]
        },

        i54: (g) => {
            const copied = smartCopy(g, 2)
            return [mutI54(copied), copied]
        },

        fract53: (g) => {
            const copied = smartCopy(g, 2)
            return [mutFract53(copied), copied]
        },
    }
}

/**
 * @internal
 */
export function randomFrom <S> (partMutRand: Fract32BasedMutRandom<S> | U32BasedMutRandom<S>): Random<S> {
    return randomFromMut(mutRandomFrom(partMutRand))
}
