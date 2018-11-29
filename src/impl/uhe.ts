// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { u32, i32, f64, isI32, isU32 } from "../util/number"
import { mashes } from "../util/mash"
import { Random, randomFrom } from "../core/random"
import { isObject } from "../util/data-validation"
import { asFract32, asU32 } from "../util/number-conversion"

/**
 * Ultra-High-Entropy (UHE) PRNG proposed by Gibson Research Corporation.
 * See https://www.grc.com/otg/uheprng.htm for more details.
 *
 * UHEPRNG is based on Alea (a Johannes Baagøe's PRNG).
 *
 * UHE uses 1536 bits of entropy (48 * 32bits).
 * In this implementation, the entropy is stored in an array of
 * unsigned integer 32bits. The original implementation uses an array of
 * float 64.
 *
 * The period of the PRNG is close to 2^1556.
 * This number is too large to fit in a float 64.
 * Details: using a = 1_768_863 as prime number and n = 1536 bits of entropy
 * we have a period of: a * 2^(n - 1) - 1 ~= 2^21 * 2^1535 = 2^1556
 *
 * Note that the hashes are differtenly computed.
 * This leads to distinct sequences of random numbers between
 * this implementation and the original one.
 */

export interface UheState {
    carry: i32 // non-negative
    seeds: Uint32Array // non-negative naturals
    phase: u32 // from 0 to seeds.length - 1
}

/**
 * Carefully chosen prime number.
 * Must be less that 2^21, in order to ensure that the
 * result of the multiplication fits in 53bits (JavaScript bound).
 *
 * Proposed choice: 187884, 686118, 898134, 1104375, 1250205, 1460910, 1768863
 */
const MULTIPLIER = 1_768_863

const INITIAL_CARRY = 1

/**
 * Number of 32bits values for entropy
 */
const ORDER = 48

/**
 * Compute the maxium number of random numbers that a state can hold.
 * Here, the maximum number is equal to ORDER.
 * @param g generator's state [Mutated]
 */
function pregenerate (g: UheState): void {
    const seeds = g.seeds
    const length = seeds.length
    let carry = g.carry
    for (let i = 0; i < length; i++) {
        const t: f64 = MULTIPLIER * asFract32(seeds[i]) + asFract32(carry)
        carry = t | 0
        seeds[i] = asU32(t - carry) // new computed seed
    }
    g.carry = carry
}

export const uhe: Random<UheState> = randomFrom({
    isValid (x: unknown): x is UheState {
        return isObject<UheState>(x) && isI32(x.carry) && x.carry >= 0 &&
            Array.isArray(x.seeds) && x.seeds.every(isU32) &&
            isU32(x.phase) && x.phase < x.seeds.length
    },

    mutU32 (g: UheState): u32 {
        const seeds = g.seeds
        let phase = g.phase
        if (phase === seeds.length) {
            // All previously generated randoms were consumed.
            // Generate the next ones.
            pregenerate(g)
            phase = 0
        }
        g.phase = phase + 1 >>> 0
        return seeds[phase]
    },

    smartCopy (g: Readonly<UheState>, n: u32): UheState {
        const carry = g.carry
        const phase = g.phase
        let seeds = g.seeds
        const unconsumedCount = seeds.length - phase
        if (n > unconsumedCount) {
            // Among the n planned generations, some generation
            // will modify the seeds array. Thus we copy it.
            seeds = new Uint32Array(seeds)
        }
        return { carry, seeds, phase }
    },

    fromUint8Array (seed: Uint8Array): UheState {
        const seeds = mashes(seed, ORDER)
        return { carry: INITIAL_CARRY, seeds, phase: seeds.length }
    },
})
