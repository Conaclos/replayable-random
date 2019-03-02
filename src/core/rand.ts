// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib } from "./distrib"
import { fract32 } from "../util/number"

/**
 * @note interface compatible with JS Math API.
 *  `const mutG: MutRand = Math`
 *
 * Mutable generator state
 */
export interface MutRand {
    /**
     * [mutated] this method mutates the object on which it is applied.
     * Sucessive calls of this method on the same state (may) change
     * its output.
     *
     * Uniform distribution.
     *
     * @return a random float (64bits) in interval [0, 1[ using
     *  32 significant bits
     */
    readonly random: () => fract32
}

/**
 * Read-only generator state
 */
export interface Rand {
    /**
     * @param d imperative distribution that provides an element of type T
     * @return a random element of type T, and the next generator state
     */
    derive: <T>(d: MutDistrib<T>) => [T, Rand]
}

/**
 * @note consider to use {@link MutRand } instead.
 *
 * Mutable generator state that can be forked.
 */
export interface ForkableMutRand extends MutRand {
    /**
     * @unsafe
     * @note this method is intended for internal use.
     *  Be sure to understand its semantic before to use it.
     *
     * Copy-on-write version of the current generator state.
     * The fork shares its state with the current generator state.
     * Mutations of the fork do not mutate the current generator state.
     * In contrast, mutations of the current generator state may mutate its
     * forks.
     *
     * As sooon as you fork a geneartor state, you should not mutate
     * this latter. Note that you can fork several times a geneartor state and
     * mutate all forks without side-effects.
     *
     * @example
     * ```
     * const fork = mutG.fork()
     * mutG.random() // unsafe, may mutate the fork
     * fork.random() // safe
     * ```
     *
     * @return a copy-on-write version of the current generator state
     */
    fork: () => ForkableMutRand
}
