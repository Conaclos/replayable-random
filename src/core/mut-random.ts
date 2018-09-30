// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { i32, u32, i54, fract32, fract53 } from "../util/number"
import { asU32, asFract32, asI32, asU32Between, asI32Between, asI54, asFract53 } from "../util/number-conversion"

/**
 * Common low-level interface for PRNG.
 * The generic type corresponds to the generator state's type.
 */
export interface MutRandom <S> {
    /**
     * @param g generator state
     * @return duplica of g
     */
    readonly deepCopy: (this: void, g: Readonly<S>) => S

    /**
     * @param g generator state [Mutated]
     * @return a random unsigned integer (32bits)
     */
    readonly mutU32: (this: void, g: S) => u32

    /**
     * @param g generator state [Mutated]
     * @return a random safe integer (54bits)
     */
    readonly mutI54: (this: void, g: S) => i54

    /**
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @param g generator state [Mutated]
     * @return a random unsigned integer (32bits) in interval [l, exclusiveU[
     */
    readonly mutU32Between: (this: void, l: u32, exclusiveU: u32) =>
        (this: void, g: S) => u32

    /**
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @param g generator state [Mutated]
     * @return a random integer (32bits) in interval [l, exclusiveU[
     */
    readonly mutI32Between: (this: void, l: i32, exclusiveU: i32) =>
        (this: void, g: S) => i32

    /**
     * @param g generator state [Mutated]
     * @return a random float in interval [0, 1[ using 32 significant bits
     */
    readonly mutFract32: (this: void, g: S) => fract32

    /**
     * @param g generator state [Mutated]
     * @return a random float in interval [0, 1[ using 53 significant bits
     */
    readonly mutFract53: (this: void, g: S) => fract53
}

const mutRandomFrom =
    <S> ({ mutFract32, mutU32, deepCopy }: Pick<MutRandom<S>, "mutFract32" | "mutU32" | "deepCopy">): MutRandom<S> => ({
        mutU32, mutFract32, deepCopy,

        mutU32Between: (l, exclusiveU) => (g) => asU32Between(l, exclusiveU, mutFract32(g)),

        mutI32Between: (l, exclusiveU) => (g) => asI32Between(l, exclusiveU, mutFract32(g)),

        mutI54: (g) => asI54(mutFract32(g), mutU32(g)),

        mutFract53: (g) => asFract53(mutU32(g), mutFract32(g)),
    })

export const randomFromMutFract32 =
    <S> ({ mutFract32, deepCopy }: Pick<MutRandom<S>, "mutFract32" | "deepCopy">): MutRandom<S> =>
        mutRandomFrom({
            mutFract32, deepCopy,
            mutU32: (g) => asU32(mutFract32(g)),
        })

export const randomFromMutU32 =
    <S> ({ mutU32, deepCopy }: Pick<MutRandom<S>, "mutU32" | "deepCopy">): MutRandom<S> =>
        mutRandomFrom({
            mutU32, deepCopy,
            mutFract32: (g) => asFract32(mutU32(g)),
        })
