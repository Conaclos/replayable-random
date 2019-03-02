// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib, Distrib } from "../core/distrib"
import { u32 } from "../util/number"
import { pureFrom, pipe } from "./base"

/**
 * Mutable version of ArrayLike<T>
 */
export interface MutArrayLike<T> {
    /**
     * Number of elements
     */
    readonly length: u32

    /**
     * `i`-th element
     */
    [i: number]: T
}

export interface ArrayMutDistrib<E> {
    /**
     * @curried
     * @param factory array factory (should be able to store items of type <E>)
     * @param n length of the array to generate
     * @return imperative distribution that geneartes an array.
     *  The array is instantiated with `factory` and contains `n`
     *  random items of type <E>
     */
    <U extends MutArrayLike<E>>(factory: { new (n: u32): U }): (
        n: u32
    ) => MutDistrib<U>
}

/**
 * @curried
 * @param d impure distribution to generate elements of type <E>
 * @param factory array factory (should be able to store items of type <E>)
 * @param n length of the array to generate
 * @return an imperative distribution that geneartes an array.
 *  The array is instantiated with `factory` and contains `n`
 *  random items of type <E>
 */
export const mutFill = <E>(d: MutDistrib<E>): ArrayMutDistrib<E> => (
    factory
) => (n) => (mutG) => {
    const result = new factory(n)
    for (let i = 0; i < result.length; i++) {
        result[i] = d(mutG)
    }
    return result
}

export interface ArrayDistrib<E> {
    /**
     * @curried
     * @param factory array factory (should be able to store items of type <E>)
     * @param n length of the array to generate
     * @return a pure distribution that geneartes an array.
     *  The array is instantiated with `factory` and contains `n`
     *  random items of type <E>
     */
    <U extends MutArrayLike<E>>(factory: { new (n: u32): U }): (
        n: u32
    ) => Distrib<U>
}

/**
 * @curried
 * @param d impure distribution to generate elements of type E
 * @param factory array factory (should be able to store items of type <E>)
 * @param n length of the array to generate
 * @return a pure distribution that geneartes an array.
 *  The array is instantiated with `factory` and contains `n`
 *  random items of type <E>
 */
export const fill = <E>(d: MutDistrib<E>): ArrayDistrib<E> => (factory) =>
    pipe(mutFill(d)(factory))(pureFrom)
