// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { i32, u32, i54, fract32, fract53 } from "../util/number"
import { MutRandom } from "./mut-random"

/**
 * Immutable common interface for seeded random generators.
 * The generic type corresponds to the generator state's type.
 */
export interface Random <S> {
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

export const randomFrom =
    <S> ({ smartCopy, mutU32, mutI54, mutU32Between, mutI32Between, mutFract32, mutFract53 }: MutRandom<S>): Random<S> => ({
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
    })
