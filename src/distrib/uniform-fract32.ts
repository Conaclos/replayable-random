// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib, Distrib } from "../core/distrib"
import { fract32 as fract32t } from "../util/number"

/**
 * @param g [mutated] generator state
 * @return a random float (32bits) in interval [0, 1[ using 32 significant bits
 */
export const mutFract32: MutDistrib<fract32t> = (g) => g.random()

/**
 * @param g generator state
 * @return a random float (64bits) in interval [0, 1[ using 32 significant bits,
 *  and next generator state
 */
export const fract32: Distrib<fract32t> = (g) => g.derive(mutFract32)