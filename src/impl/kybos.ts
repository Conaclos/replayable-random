// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { u32, fract32, f64, isNonNegFract32, isU32 } from "../util/number"
import { mashes } from "../util/mash"
import { Random, randomFrom } from "../core/random"
import { isObject } from "../util/data-validation"
import { asFract32, asU32Between } from "../util/number-conversion"
import { AleaState, aleaMutBase } from "./alea"
import { U4_EMPTY_SET, add, has } from "../util/u4-set"

/**
 * Kybos: Johannes Baagøe's PRNG that combines
 * Alea with a variant of the Bays-Durham shuffle.
 * See http://baagoe.org/en/wiki/Better_random_numbers_for_javascript for more details.
 * 2012-06-19 snapshot: https://web.archive.org/web/20120619002808/http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
 * Mirror: https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
 *
 * Kybos uses 256 bits of entropy stored as eight fract32.
 * Notet hat a fract32 is encoded as a float 64.
 */

export interface KybosState extends AleaState {
    seeds: Float64Array // non-negative fract32
    phase: u32 // from 0 to seeds.length - 1
    consumable: u32 // from 0 to seeds.length - 1
}

const INITIAL_CARRY = 1

/**
 * Number of 32bits values for entropy
 * Must be inferior or equal to 16 because we use U4Set
 */
const ORDER = 8

/**
 * Compute the maxium number of random numbers
 * without erasing freshly genarted.
 * @param g generator's state [Mutated]
 */
function pregenerate (g: KybosState): void {
    const seeds = g.seeds
    const length = seeds.length

    let bitset = add(U4_EMPTY_SET, g.phase)
    let phase = g.phase
    let consumable = 0
    do {
        let seed = seeds[phase] - aleaMutBase.mutFract32(g)
        if (seed < 0) {
            seed = seed + 1
        }
        seeds[phase] = seed

        bitset = add(bitset, phase)
        phase = asU32Between(0, length, seeds[phase])
        consumable++
    } while (! has(bitset, phase))
    g.consumable = consumable
}

export const kybos: Random<KybosState> = randomFrom({
    isValid (x: unknown): x is KybosState {
        return isObject<KybosState>(x) &&
            Array.isArray(x.seeds) && x.seeds.every(isNonNegFract32) &&
            isU32(x.phase) && x.phase >= 0 &&
            isU32(x.consumable) && x.consumable >= 0 &&
            aleaMutBase.isValid(x)
    },

    mutFract32 (g: KybosState): fract32 {
        if (g.consumable === 0) {
            // All previously generated randoms were consumed.
            // Generate the next ones.
            pregenerate(g)
        }

        const { seeds, phase } = g
        g.phase = asU32Between(0, seeds.length, seeds[phase])
        g.consumable--
        return seeds[phase]
    },

    smartCopy (g: Readonly<KybosState>, n: u32): KybosState {
        let seeds = g.seeds
        if (n > g.consumable) {
            seeds = new Float64Array(seeds)
        }
        return {
            carry: g.carry,
            seed0: g.seed0,
            seed1: g.seed1,
            seed2: g.seed2,
            phase: g.phase,
            consumable: g.consumable,
            seeds,
        } // Do not use object spreading. Emitted helper hurts perfs.
    },

    fromUint8Array (seed: Uint8Array): KybosState {
        const hashes = mashes(seed, 3 + ORDER)
        const seed0 = asFract32(hashes[0])
        const seed1 = asFract32(hashes[1])
        const seed2 = asFract32(hashes[2])
        const seeds = new Float64Array(ORDER)
        for (let i = 0; i < seeds.length; i++) {
            seeds[i] = asFract32(hashes[i + 3])
        }
        return {
            seed0, seed1, seed2, seeds,
            carry: INITIAL_CARRY, phase: 0, consumable: 0
        }
    },
})
