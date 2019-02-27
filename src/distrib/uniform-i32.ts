// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib, Distrib } from "../core/distrib"
import { i32 as i32t } from "../util/number"
import { asU32, asI32Between } from "../util/number-conversion"
import { pureFrom, pipe } from "../helper/base"
import { fill, ArrayDistrib } from "../helper/array-helper"

/**
 * @param g [mutated] generator state
 * @return a random signed integer (32bits)
 */
export const mutI32: MutDistrib<i32t> = (g) => asU32(g.random()) | 0

/**
 * @param g generator state
 * @return a random signed integer (32bits), and next generator state
 */
export const i32: Distrib<i32t> = (g) => g.derive(mutI32)

/**
 * @note the returned function cannot produce the maximum signed integer.
 * Use {@link mutI32 } to generate any signed integer (32bits).
 *
 * @param l lower bound (inclusive)
 * @param excludedU upper bound (excluded)
 * @return a function that accepts and mutates a random generator, and
 *  returns a random signed integer (32bits) in interval [l, exclusiveU[
 */
export const mutI32Between = (l: i32t) => (
    excludedU: i32t
): MutDistrib<i32t> => (g) => asI32Between(l, excludedU, g.random())

/**
 * @param l lower bound (inclusive)
 * @param excludedU upper bound (excluded)
 * @return function that accepts a generator state and returns
 *      a random integer (32bits) in interval [l, excludedU[ along with
 *      the next generator state
 */
export const i32Between: (l: i32t) => (excludedU: i32t) => Distrib<i32t> = (
    l
) => pipe(mutI32Between(l))(pureFrom)

/**
 * @note
 *  If you use Array as factory you should explicitly set the generic
 *  with the expected array type:
 *  i32Fill<Array<number>>(Array)
 *
 * @example
 *  i32Fill(Int32Array)(50)(g)
 *  i32Fill<Array<number>>(Array)(50)(g)
 *
 * @param factory array factory (should be Array or Int32Array)
 * @return a function that accepts the length of the array to insatntiate, and
 *  returns a pure distribution that returns the instantiated array fullfilled
 *  with random signed integers (32bits)
 */
export const i32Fill: ArrayDistrib<i32t> = (factory) => fill(mutI32)(factory)
