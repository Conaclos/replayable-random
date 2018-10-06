// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { u32, i32, fract32, f64 } from "../util/number"
import { mashes } from "../util/mash"
import { randomFromMutU32 } from "../core/mut-random"
import { Random, randomFrom } from "../core/random"
import { RandomFactory, randomFactoryFrom } from "../core/random-factory"
import { RandomStreamFactory, srandomStreamFactoryFrom } from "../core/random-stream-factory"
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
    seeds: Uint32Array // non-negative floats
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

const uheMutRandom = randomFromMutU32({
    mutU32 (g: UheState): u32 {
        const seeds = g.seeds
        const phase = g.phase

        const t: f64 = MULTIPLIER * asFract32(seeds[phase]) + asFract32(g.carry)
        const carry = t | 0
        const rand = asU32(t - carry) // new computed seed

        g.carry = carry
        seeds[phase] = rand
        g.phase = (phase + 1) % ORDER >>> 0
        return rand
    },

    smartCopy (g: Readonly<UheState>): UheState {
        const carry = g.carry
        const seeds = new Uint32Array(g.seeds)
        const phase = g.phase
        return { carry, seeds, phase }
    }
})

const uheRandomFactory = randomFactoryFrom({
    fromUint8Array (seed: Uint8Array): UheState {
        const seeds = mashes(seed, ORDER)
        return { carry: INITIAL_CARRY, seeds, phase: 0 }
    },
})

const uheRandomStreamFactory = srandomStreamFactoryFrom(uheMutRandom, uheRandomFactory)

const uheRandom = randomFrom(uheMutRandom)

export const uhe: Random<UheState> & RandomFactory<UheState> & RandomStreamFactory<UheState> = {
    ...uheRandom,
    ...uheRandomFactory,
    ...uheRandomStreamFactory
}
