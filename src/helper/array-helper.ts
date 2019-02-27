// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib, Distrib } from "../core/distrib"
import { u32 } from "../util/number"
import { pureFrom, pipe } from "./base"

/**
 * Mutable version of ArrayLike<T>
 */
export interface MutArrayLike<T> {
    readonly length: u32
    [i: number]: T
}

/**
 * Function that accepts a factory of array, and returns a
 * function that accepts the number of element to generate, and returns an
 * imperative distribution.
 *
 * The factory should be Array or a typed array constructor if the type of
 * generated element fits.
 */
export interface ArrayMutDistrib<E> {
    <U extends MutArrayLike<E>>(
        factory: {
            new (n: u32): U
        }
    ): (n: u32) => MutDistrib<U>
}

/**
 * @param d impure distribution to generate element of type E
 * @return function that accepts the number of element to generate, and returns
 *  a function that accepts a random generator, and returns
 *  a random element of type E
 */
export const mutFill = <E>(d: MutDistrib<E>): ArrayMutDistrib<E> => (
    factory
) => (n) => (g) => {
    const result = new factory(n)
    for (let i = 0; i < result.length; i++) {
        result[i] = d(g)
    }
    return result
}

/**
 * Function that accepts a factory of array, and returns a
 * function that accepts the number of element to generate, and returns an
 * pure distribution.
 *
 * The factory should be Array or a typed array constructor if the type of
 * generated element fits.
 */
export interface ArrayDistrib<E> {
    <U extends MutArrayLike<E>>(
        factory: {
            new (n: u32): U
        }
    ): (n: u32) => Distrib<U>
}

/**
 * @param d impure distribution to generate element of type E
 * @return function that accepts the number of element to generate, and returns
 *  a function that accepts a random generator, and returns
 *  a random element of type E and next generator state
 */
export const fill = <E>(d: MutDistrib<E>): ArrayDistrib<E> => (factory) =>
    pipe(mutFill(d)(factory))(pureFrom)
