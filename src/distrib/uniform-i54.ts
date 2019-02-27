// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib, Distrib } from "../core/distrib"
import { i54 as i54t } from "../util/number"
import { asI54 } from "../util/number-conversion"
import { fill, ArrayDistrib } from "../helper/array-helper"

/**
 * @param g [mutated] generator state
 * @return a random safe signed integer (54bits)
 */
export const mutI54: MutDistrib<i54t> = (g) => asI54(g.random(), g.random())

/**
 * @param g generator state
 * @return a random safe signed integer (54bits), and next generator state
 */
export const i54: Distrib<i54t> = (g) => g.derive(mutI54)

/**
 * @note
 *  If you use Array as factory you should explicitly set the generic
 *  with the expected array type:
 *  i54Fill<Array<number>>(Array)
 *
 * @example
 *  i54Fill(Float64Array)(50)(g)
 *  i54Fill<Array<number>>(Array)(50)(g)
 *
 * @param factory array factory (should be Array or Float64Array)
 * @return a function that accepts the length of the array to insatntiate, and
 *  returns a pure distribution that returns the instantiated array fullfilled
 *  with random safe signed integer (54bits)
 */
export const i54Fill: ArrayDistrib<i54t> = (factory) => fill(mutI54)(factory)
