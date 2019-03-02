// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib, Distrib } from "../core/distrib"
import { i32 as i32t } from "../util/number"
import { asU32, asI32Between } from "../util/number-conversion"
import { pureFrom, pipe } from "../helper/base"
import { fill, ArrayDistrib } from "../helper/array-helper"

/**
 * @param mutG [mutated] generator state
 * @return a random signed integer (32bits)
 */
export const mutI32: MutDistrib<i32t> = (mutG) => asU32(mutG.random()) | 0

/**
 * @param g generator state
 * @return a random signed integer (32bits), and next generator state
 */
export const i32: Distrib<i32t> = (g) => g.derive(mutI32)

/**
 * @curried
 * @param l lower bound (inclusive)
 * @param excludedU upper bound (excluded)
 * @return an imperative distribution that generates a
 *  random signed integer (32bits) in interval [l, exclusiveU[
 */
export const mutI32Between = (l: i32t) => (
    excludedU: i32t
): MutDistrib<i32t> => (mutG) => asI32Between(l, excludedU, mutG.random())

/**
 * @curried
 * @param l lower bound (inclusive)
 * @param excludedU upper bound (excluded)
 * @return a pure distribution that generates a
 *  random signed integer (32bits) in interval [l, exclusiveU[
 */
export const i32Between: (l: i32t) => (excludedU: i32t) => Distrib<i32t> = (
    l
) => pipe(mutI32Between(l))(pureFrom)

/**
 * @example
 *  i32Fill(Int32Array)(50)(g)
 *  i32Fill<Array<number>>(Array)(50)(g)
 *
 * @curried
 * @param factory array factory (should be Array or Int32Array)
 * @param n length of the array to generate
 * @return a pure distribution that geneartes an array.
 *  The array is instantiated with `factory` and contains `n`
 *  random signed integers (32bits)
 */
export const i32Fill: ArrayDistrib<i32t> = (factory) => fill(mutI32)(factory)
