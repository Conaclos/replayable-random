// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { u32, fract32, f64, isNonNegFract32, isU32 } from "../util/number"
import { mashes } from "../util/mash"
import { mutRandomFrom } from "../core/mut-random"
import { Random, randomFrom } from "../core/random"
import { isObject } from "../util/data-validation"
import { arayFrom } from "../util/typed-array"
import { asFract32, asU32Between } from "../util/number-conversion"
import { ALEA_TYPE_LABEL, AleaState, mutAlea } from "./alea"
import { U4_EMPTY_SET, add, has } from "../util/u4-set"

/**
 * Kybos: Johannes Baagøe's PRNG that combines
 * Alea with a variant of the Bays-Durham shuffle.
 * See http://baagoe.org/en/wiki/Better_random_numbers_for_javascript for more details.
 * 2012-06-19 snapshot: https://web.archive.org/web/20120619002808/http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
 * Mirror: https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
 *
 * Kybos uses 256 bits of entropy stored as eight fract32.
 * Notet that a fract32 is encoded as a float 64.
 */

export const KYBOS_TYPE_LABEL: "kybos" = "kybos"

export interface KybosState {
    readonly type: typeof KYBOS_TYPE_LABEL
    subprng: AleaState
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
    const { seeds, subprng } = g
    const length = seeds.length

    let bitset = add(U4_EMPTY_SET, g.phase)
    let phase = g.phase
    let consumable = 0
    do {
        let seed = seeds[phase] - mutAlea.nextFract32.call(subprng)
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

export const mutKybos = mutRandomFrom({
    nextFract32 (this: KybosState): fract32 {
        if (this.consumable === 0) {
            // All previously generated randoms were consumed.
            // Generate the next ones.
            pregenerate(this)
        }

        const { seeds, phase } = this
        this.phase = asU32Between(0, seeds.length, seeds[phase])
        this.consumable--
        return seeds[phase]
    },

    smartCopy (g: Readonly<KybosState>, n: u32): KybosState {
        let { seeds, subprng } = g
        if (n > g.consumable) {
            seeds = new Float64Array(seeds)
            subprng = mutAlea.smartCopy(g.subprng, n)
        }
        return {
            type: KYBOS_TYPE_LABEL,
            subprng, seeds,
            phase: g.phase,
            consumable: g.consumable,
        } // Do not use object spreading. Emitted helper hurts perfs.
    },

    fromUint8Array (seed: Uint8Array): KybosState {
        const hashes = mashes(seed, 3 + ORDER)
        const seed0 = asFract32(hashes[0])
        const seed1 = asFract32(hashes[1])
        const seed2 = asFract32(hashes[2])
        const seeds = new Float64Array(ORDER)
        for (let i = 0; i < seeds.length; i++) {
            seeds[i] = asFract32(hashes[3 + i])
        }
        return {
            type: KYBOS_TYPE_LABEL,
            subprng: {
                seed0, seed1, seed2,
                type: ALEA_TYPE_LABEL, carry: INITIAL_CARRY,
            },
            seeds, phase: 0, consumable: 0,
        }
    },

    fromPlain (x: unknown): KybosState | undefined {
        if (isObject<KybosState>(x) && x.type === KYBOS_TYPE_LABEL &&
            isU32(x.phase) && isU32(x.consumable) && isObject(x.seeds)) {

            const subprng = mutAlea.fromPlain(x.subprng)
            const seeds = arayFrom(x.seeds, Float64Array, isNonNegFract32)

            if (subprng !== undefined && seeds.length > 0 &&
                x.phase < seeds.length && x.consumable < seeds.length) {

                return {
                    type: KYBOS_TYPE_LABEL,
                    seeds, subprng, phase: x.phase, consumable: x.consumable,
                }
            }
        }
        return undefined
    },
})

export const kybos: Random<KybosState> = randomFrom(mutKybos)
