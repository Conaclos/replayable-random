// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { i32, u32, i54, fract32, fract53 } from "../util/number"
import { stringAsUint8Array } from "../util/string-encoding"
import { asU32, asFract32, asU32Between, asI32Between, asI54, asFract53 } from "../util/number-conversion"

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
     * @param g generator state
     * @param n maximum number of atomic generations that can be performed on
     *  the copy without modifying the original (g)
     * @return (partial) duplica of g
     */
    readonly smartCopy: (this: void, g: Readonly<S>, n: u32) => S

// Random generation
    /**
     * Atomic generation: 1
     * @param g generator state [Mutated]
     * @return a random unsigned integer (32bits)
     */
    readonly mutU32: (this: void, g: S) => u32

    /**
     * Atomic generation: 2
     * @param g generator state [Mutated]
     * @return a random safe integer (54bits)
     */
    readonly mutI54: (this: void, g: S) => i54

    /**
     * Atomic generation: 1
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @param g generator state [Mutated]
     * @return a random unsigned integer (32bits) in interval [l, exclusiveU[
     */
    readonly mutU32Between: (this: void, l: u32, exclusiveU: u32, g: S) => u32

    /**
     * Atomic generation: 1
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @param g generator state [Mutated]
     * @return a random integer (32bits) in interval [l, exclusiveU[
     */
    readonly mutI32Between: (this: void, l: i32, exclusiveU: i32, g: S) => i32

    /**
     * Atomic generation: 1
     * @param g generator state [Mutated]
     * @return a random float in interval [0, 1[ using 32 significant bits
     */
    readonly mutFract32: (this: void, g: S) => fract32

    /**
     * Atomic generation: 2
     * @param g generator state [Mutated]
     * @return a random float in interval [0, 1[ using 53 significant bits
     */
    readonly mutFract53: (this: void, g: S) => fract53
}

/**
 * @internal
 */
export type Fract32BasedMutRandom <S> = Pick<MutRandom<S>, "mutFract32" | "smartCopy" | "fromUint8Array">

/**
 * @internal
 */
export type U32BasedMutRandom <S> = Pick<MutRandom<S>, "mutU32" | "smartCopy" | "fromUint8Array">

type MutRandomBase <S> = Fract32BasedMutRandom<S> & U32BasedMutRandom<S>

const mutRandomFromBase =
    <S> ({ mutFract32, mutU32, fromUint8Array, smartCopy }: MutRandomBase<S>): MutRandom<S> => ({
        mutU32, mutFract32, smartCopy, fromUint8Array,

        from: (seed: string) => fromUint8Array(stringAsUint8Array(seed)),

        mutU32Between: (l, exclusiveU, g) => asU32Between(l, exclusiveU, mutFract32(g)),

        mutI32Between: (l, exclusiveU, g) => asI32Between(l, exclusiveU, mutFract32(g)),

        mutI54: (g) => asI54(mutFract32(g), mutU32(g)),

        mutFract53: (g) => asFract53(mutU32(g), mutFract32(g)),
    })

const randomFromMutFract32 =
    <S> ({ mutFract32, smartCopy, fromUint8Array }: Fract32BasedMutRandom<S>): MutRandom<S> =>
        mutRandomFromBase({
            mutFract32, smartCopy, fromUint8Array,
            mutU32: (g) => asU32(mutFract32(g)),
        })

const randomFromMutU32 =
    <S> ({ mutU32, smartCopy, fromUint8Array }: U32BasedMutRandom<S>): MutRandom<S> =>
        mutRandomFromBase({
            mutU32, smartCopy, fromUint8Array,
            mutFract32: (g) => asFract32(mutU32(g)),
        })

/**
 * @internal
 */
export const mutRandomFrom =
    <S> (partMutRand: Fract32BasedMutRandom<S> | U32BasedMutRandom<S>): MutRandom<S> => {
        if ("mutFract32" in partMutRand) {
            return randomFromMutFract32(partMutRand)
        } else {
            return randomFromMutU32(partMutRand)
        }
    }
