// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib, Distrib } from "../core/distrib"
import { u32 as u32t } from "../util/number"
import { asU32, asU32Between } from "../util/number-conversion"
import { pureFrom, pipe } from "../helper/base"
import { fill, ArrayDistrib } from "../helper/array-helper"

/**
 * @param g [mutated] generator state
 * @return a random unsigned integer (32bits)
 */
export const mutU32: MutDistrib<u32t> = (g) => asU32(g.random())

/**
 * @param g generator state
 * @return a random unsigned integer (32bits), and next generator state
 */
export const u32: Distrib<u32t> = (g) => g.derive(mutU32)

/**
 * @note the returned function cannot produce the maximum unsigned integer.
 * Use {@link mutU32 } to generate any unsigned integer (32bits).
 *
 * @param l lower bound (inclusive)
 * @param excludedU upper bound (excluded)
 * @return a function that accepts and mutates a random generator, and
 *  returns a random unsigned integer (32bits) in interval [l, exclusiveU[
 */
export const mutU32Between = (l: u32t) => (
    excludedU: u32t
): MutDistrib<u32t> => (g) => asU32Between(l, excludedU, g.random())

/**
 * @param l lower bound (inclusive)
 * @param excludedU upper bound (excluded)
 * @return function that accepts a generator state and returns
 *      a random unsigned integer (32bits) in interval [l, excludedU[ with
 *      the next generator state
 */
export const u32Between: (l: u32t) => (excludedU: u32t) => Distrib<u32t> = (
    l
) => pipe(mutU32Between(l))(pureFrom)

/**
 * @note
 *  If you use Array as factory you should explicitly set the generic
 *  with the expected array type:
 *  u32Fill<Array<number>>(Array)
 *
 * @example
 *  u32Fill(Uint32Array)(50)(g)
 *  u32Fill<Array<number>>(Array)(50)(g)
 *
 * @param factory array factory (should be Array or Uint32Array)
 * @return a function that accepts the length of the array to insatntiate, and
 *  returns a pure distribution that returns the instantiated array fullfilled
 *  with random unsigned integers (32bits)
 */
export const u32Fill: ArrayDistrib<u32t> = (factory) => fill(mutU32)(factory)
