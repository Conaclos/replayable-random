// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib, Distrib } from "../core/distrib"
import { u32 as u32t, isU32 } from "../util/number"
import { asU32, asU32Between } from "../util/number-conversion"
import { pureFrom, pipe, compose } from "../helper/base"
import { fill, ArrayDistrib } from "../helper/array-helper"
import { assert } from "../util/assert"
import { mutFract32 } from "./uniform-fract32"

/**
 * @param mutG [mutated] generator state
 * @return a random unsigned integer (32bits)
 */
export const mutU32: MutDistrib<u32t> = (mutG) => asU32(mutG.random())

/**
 * @param g generator state
 * @return a random unsigned integer (32bits), and next generator state
 */
export const u32: Distrib<u32t> = pureFrom(mutU32)

/**
 * @curried
 * @param l lower bound (inclusive)
 * @param excludedU upper bound (excluded)
 * @return an imperative distribution that generates a random
 *  unsigned integer (32bits) in interval [l, exclusiveU[
 */
export const mutU32Between = (l: u32t) => {
    assert(isU32(l), "l must be a u32")
    return (excludedU: u32t): MutDistrib<u32t> => {
        assert(isU32(excludedU), "excludedU must be a u32")
        assert(l < excludedU, "l must be lower than excludedU")
        return (mutG) => asU32Between(l, excludedU, mutG.random())
    }
}

/**
 * @curried
 * @param l lower bound (inclusive)
 * @param excludedU upper bound (excluded)
 * @return a pure distribution that generates a
 *  random unsigned integer (32bits) in interval [l, exclusiveU[
 */
export const u32Between: (l: u32t) => (excludedU: u32t) => Distrib<u32t> = pipe(
    mutU32Between
)(compose(pureFrom))

/**
 * @example
 *  u32Fill(Uint32Array)(50)(g)
 *  u32Fill<Array<number>>(Array)(50)(g)
 *
 * @curried
 * @param factory array factory (should be Array or Uint32Array)
 * @param n length of the array to generate
 * @return a pure distribution that geneartes an array.
 *  The array is instantiated with `factory` and contains `n`
 *  random unsigned integer (32bits)
 */
export const u32Fill: ArrayDistrib<u32t> = fill(mutU32)
