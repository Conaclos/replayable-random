// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { mutRandomFrom } from "../core/mut-random"
import { Random, randomFrom } from "../core/random"
import { isObject } from "../util/data-validation"
import { mashes } from "../util/mash"
import { f64, i32, isI32, isU32, u32 } from "../util/number"
import { asFract32, asU32 } from "../util/number-conversion"
import { arayFrom, TypeableArray } from "../util/typed-array"

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

export const UHE_TYPE_LABEL: "uhe" = "uhe"

export interface MutUheState {
    readonly type: typeof UHE_TYPE_LABEL
    carry: i32 // non-negative
    seeds: TypeableArray<u32> // non-negative u32
    phase: u32 // from 0 to seeds.length - 1
}

export type UheState = Readonly<MutUheState>

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
function pregenerate(g: MutUheState): void {
    const { seeds } = g
    const length = seeds.length
    let carry = g.carry
    for (let i = 0; i < length; i++) {
        const t: f64 = MULTIPLIER * asFract32(seeds[i]) + asFract32(carry)
        carry = t | 0
        seeds[i] = asU32(t - carry) // new computed seed
    }
    g.carry = carry
}

export const mutUhe = mutRandomFrom({
    nextU32(this: MutUheState): u32 {
        const seeds = this.seeds
        let phase = this.phase
        if (phase === seeds.length) {
            // All previously generated randoms were consumed.
            // Generate the next ones.
            pregenerate(this)
            phase = 0
        }
        this.phase = (phase + 1) >>> 0
        return seeds[phase]
    },

    smartCopy(g: UheState, n: u32): MutUheState {
        const carry = g.carry
        const phase = g.phase
        let seeds = g.seeds
        const unconsumedCount = seeds.length - phase
        if (n > unconsumedCount) {
            // Among the n planned generations, some generation
            // will modify the seeds array. Thus we copy it.
            seeds = new Uint32Array(seeds)
        }
        return { type: UHE_TYPE_LABEL, carry, seeds, phase }
    },

    fromUint8Array(seed: Uint8Array): MutUheState {
        const seeds = mashes(seed, ORDER)
        return {
            type: UHE_TYPE_LABEL,
            seeds,
            carry: INITIAL_CARRY,
            phase: seeds.length,
        }
    },

    fromPlain(x: unknown): MutUheState | undefined {
        if (
            isObject<UheState>(x) &&
            x.type === UHE_TYPE_LABEL &&
            isI32(x.carry) &&
            x.carry > 0 &&
            isU32(x.phase) &&
            isObject(x.seeds)
        ) {
            const seeds = arayFrom(x.seeds, Uint32Array, isU32)
            if (seeds.length > 0 && x.phase <= seeds.length) {
                return {
                    type: UHE_TYPE_LABEL,
                    seeds: Uint32Array.from(seeds),
                    carry: x.carry,
                    phase: x.phase,
                }
            }
        }
        return undefined
    },
})

export const uhe: Random<UheState> = randomFrom(mutUhe)
