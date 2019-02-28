// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib } from "../core/distrib"
import { ForkableMutRand, Rand } from "../core/rand"
import { ForkableMutRandFrom, RandFrom, MutRandFrom } from "../core/rand-from"
import { isObject, FromPlain } from "../util/data-validation"
import { mashes } from "../util/mash"
import { f64, i32, isI32, isU32, u32 } from "../util/number"
import { asFract32, asU32 } from "../util/number-conversion"
import { U32Array, U8Array } from "../util/typed-array"
import { stringAsU8Array } from "../util/string-encoding"

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

const UHE_TYPE_LABEL: "uhe" = "uhe"

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
function pregenerate(g: Uhe): void {
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

class Uhe implements ForkableMutRand, Rand {
    readonly type = UHE_TYPE_LABEL

    constructor(
        public carry: i32, // non-negative
        public seeds: U32Array,
        public phase: u32, // from 0 to seeds.length (included)
        public isShared: boolean
    ) {}

    derive<T>(d: MutDistrib<T>): [T, Rand] {
        const mutable = this.fork()
        const generated = d(mutable)
        return [generated, mutable]
    }

    fork(): Uhe {
        return new Uhe(this.carry, this.seeds, this.phase, true) // shallow copy
    }

    random(): u32 {
        const seeds = this.seeds
        let phase = this.phase
        if (phase === seeds.length) {
            // All previously generated randoms were consumed.
            // Generate the next ones.
            if (this.isShared) {
                // full copy
                this.seeds = this.seeds.slice()
                this.isShared = false
            }
            pregenerate(this)
            phase = 0
        }
        this.phase = (phase + 1) >>> 0
        return asFract32(seeds[phase])
    }

    toJSON(): Uhe {
        let result: Uhe = this
        if ("from" in Array) {
            // Array.from is an ES6 feature
            result = this.fork()
            result.seeds = Array.from(result.seeds)
        }
        return result
    }
}

function internalFromBytes(seed: U8Array): Uhe {
    const seeds = mashes(seed, ORDER)
    return new Uhe(INITIAL_CARRY, seeds, seeds.length, false)
}

export const fromBytes: RandFrom<U8Array> = internalFromBytes

export const mutFromBytes: ForkableMutRandFrom<U8Array> = internalFromBytes

const internalFrom = (seed: string) => internalFromBytes(stringAsU8Array(seed))

export const from: RandFrom<string> = internalFrom

export const mutFrom: MutRandFrom<string> = internalFrom

function internalFromPlain(x: unknown): Uhe | undefined {
    if (
        isObject<Uhe>(x) &&
        x.type === UHE_TYPE_LABEL &&
        isI32(x.carry) &&
        x.carry > 0 &&
        isU32(x.phase) &&
        x.seeds instanceof Array &&
        x.seeds.length > 0 &&
        x.phase <= x.seeds.length
    ) {
        let seeds
        if (U32Array.from !== undefined) {
            seeds = (U32Array as Uint32ArrayConstructor).from(x.seeds)
        } else {
            seeds = x.seeds.slice()
        }
        return new Uhe(x.carry, seeds, x.phase, false)
    }
    return undefined
}

export const fromPlain: FromPlain<Rand> = internalFromPlain

export const mutFromPlain: FromPlain<ForkableMutRand> = internalFromPlain