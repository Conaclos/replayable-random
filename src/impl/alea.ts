// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { i32, fract32, f64 } from "../util/number"
import { mashes } from "../util/mash"
import { Random, randomFrom } from "../core/random"
import { asFract32 } from "../util/number-conversion"

/**
 * Alea: Johannes Baagøe's PRNG designed for high-efficiency in JavaScript.
 * See http://baagoe.org/en/wiki/Better_random_numbers_for_javascript for more details.
 * 2012-06-19 snapshot: https://web.archive.org/web/20120619002808/http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
 * Mirror: https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
 *
 * Johannes Baagøe's PRNG is based on the robust Multiply-With-Carry (MWC)
 * PRNG invented by George Marsaglia.
 * See http://www.GRC.com/otg/Marsaglia_PRNGs.pdf for more details.
 * See also http://www.GRC.com/otg/Marsaglia_MWC_Generators.pdf
 *
 * Alea uses 96 bits of entropy stored as three fract32.
 * Notet hat a fract32 is encoded as a float 64.
 *
 * The period of the PRNG is close to 2^116.
 * Details: using a = 2_091_639 as prime number and n = 96 bits of entropy
 * we have a period of: a * 2^(n - 1) - 1 ~= 2^21 * 2^95 = 2^116
 */

export interface AleaState {
    carry: i32 // non-negative
    seed0: fract32 // non-negative
    seed1: fract32 // non-negative
    seed2: fract32 // non-negative
}

/**
 * Carefully chosen prime number.
 * Must be less that 2^21, in order to ensure that the
 * result of the multiplication fits in 53bits (JavaScript bound).
 */
const MULTIPLIER = 2_091_639

const INITIAL_CARRY = 1

export const alea: Random<AleaState> = randomFrom({
    mutFract32 (g: AleaState): fract32 {
        const t: f64 = MULTIPLIER * g.seed0 + asFract32(g.carry)
        g.carry = t | 0
        // seeds' rotation
        g.seed0 = g.seed1
        g.seed1 = g.seed2
        g.seed2 = t - g.carry // new computed seed
        return g.seed2
    },

    smartCopy (g: Readonly<AleaState>): AleaState {
        return {
            carry: g.carry,
            seed0: g.seed0,
            seed1: g.seed1,
            seed2: g.seed2,
        } // Do not use object spreading. Emitted helper hurts perfs.
    },

    fromUint8Array (seed: Uint8Array): AleaState {
        const hashes = mashes(seed, 3)
        const seed0 = asFract32(hashes[0])
        const seed1 = asFract32(hashes[1])
        const seed2 = asFract32(hashes[2])
        return { carry: INITIAL_CARRY, seed0, seed1, seed2 }
    },
})
