// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib, Distrib } from "../core/distrib"
import { asFract53 } from "../util/number-conversion"
import { fract53 as fract53t } from "../util/number"

/**
 * @param mutG [mutated] generator state
 * @return a random float (64bits) in interval [0, 1[ using 53 significant bits
 */
export const mutFract53: MutDistrib<fract53t> = (mutG) =>
    asFract53(mutG.random(), mutG.random())

/**
 * @param g generator state
 * @return a random float (64bits) in interval [0, 1[ using 53 significant bits,
 *  and next generator state
 */
export const fract53: Distrib<fract53t> = (g) => g.derive(mutFract53)
