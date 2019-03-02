// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib, Distrib } from "../core/distrib"
import { i54 as i54t } from "../util/number"
import { asI54 } from "../util/number-conversion"
import { fill, ArrayDistrib } from "../helper/array-helper"

/**
 * @param mutG [mutated] generator state
 * @return a random safe signed integer (54bits)
 */
export const mutI54: MutDistrib<i54t> = (mutG) =>
    asI54(mutG.random(), mutG.random())

/**
 * @param g generator state
 * @return a random safe signed integer (54bits), and next generator state
 */
export const i54: Distrib<i54t> = (g) => g.derive(mutI54)

/**
 * @example
 *  i54Fill(Float64Array)(50)(g)
 *  i54Fill<Array<number>>(Array)(50)(g)
 *
 * @curried
 * @param factory array factory (should be Array or Float64Array)
 * @param n length of the array to generate
 * @return a pure distribution that geneartes an array.
 *  The array is instantiated with `factory` and contains `n`
 *  random safe signed integer (54bits)
 */
export const i54Fill: ArrayDistrib<i54t> = (factory) => fill(mutI54)(factory)
