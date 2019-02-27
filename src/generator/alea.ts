// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib } from "../core/distrib"
import { ForkableMutRand, Rand } from "../core/rand"
import { ForkableMutRandFrom, RandFrom, MutRandFrom } from "../core/rand-from"
import { isObject, FromPlain } from "../util/data-validation"
import { mashes } from "../util/mash"
import { f64, fract32, i32, isNonNegFract32, isU32 } from "../util/number"
import { asFract32 } from "../util/number-conversion"
import { stringAsU8Array } from "../util/string-encoding"
import { U8Array } from "../util/typed-array"

/**
 * Alea: Johannes Baagøe's PRNG designed for high-efficiency in JavaScript.
 * See http://baagoe.org/en/wiki/Better_random_numbers_for_javascript for more details.
 * 2012-06-19 snapshot: https://web.archive.org/web/20120619002808/http://baagoe.org/en/wiki/Better_random_numbers_for_javascript#Alea
 * Mirror: https://github.com/nquinlan/better-random-numbers-for-javascript-mirror#alea
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

const ALEA_TYPE_LABEL: "alea" = "alea"

/**
 * Carefully chosen prime number.
 * Must be less that 2^21, in order to ensure that the
 * result of the multiplication fits in 53bits (JavaScript bound).
 */
const MULTIPLIER = 2_091_639

const INITIAL_CARRY = 1

class Alea implements ForkableMutRand, Rand {
    readonly type = ALEA_TYPE_LABEL

    constructor(
        public carry: i32, // non-negative
        public seed0: fract32, // non-negative
        public seed1: fract32, // non-negative
        public seed2: fract32 // non-negative
    ) {}

    derive<T>(d: MutDistrib<T>): [T, Rand] {
        const mutable = this.fork()
        const generated = d(mutable)
        return [generated, mutable]
    }

    fork(): Alea {
        return new Alea(this.carry, this.seed0, this.seed1, this.seed2)
    }

    random(): fract32 {
        const t: f64 = MULTIPLIER * this.seed0 + asFract32(this.carry)
        this.carry = t | 0
        // seeds' rotation
        this.seed0 = this.seed1
        this.seed1 = this.seed2
        this.seed2 = t - this.carry // new computed seed
        return this.seed2
    }
}

function internalFromBytes(seed: U8Array): Alea {
    const hashes = mashes(seed, 3)
    const seed0 = asFract32(hashes[0])
    const seed1 = asFract32(hashes[1])
    const seed2 = asFract32(hashes[2])
    return new Alea(INITIAL_CARRY, seed0, seed1, seed2)
}

export const fromBytes: RandFrom<U8Array> = internalFromBytes

export const mutFromBytes: ForkableMutRandFrom<U8Array> = internalFromBytes

const internalFrom = (seed: string) => internalFromBytes(stringAsU8Array(seed))

export const from: RandFrom<string> = internalFrom

export const mutFrom: MutRandFrom<string> = internalFrom

function internalFromPlain(x: unknown): Alea | undefined {
    if (
        isObject<Alea>(x) &&
        x.type === ALEA_TYPE_LABEL &&
        isU32(x.carry) &&
        x.carry > 0 &&
        isNonNegFract32(x.seed0) &&
        isNonNegFract32(x.seed1) &&
        isNonNegFract32(x.seed2)
    ) {
        return new Alea(x.carry, x.seed0, x.seed1, x.seed2)
    }
    return undefined
}

export const fromPlain: FromPlain<Rand> = internalFromPlain

export const mutFromPlain: FromPlain<ForkableMutRand> = internalFromPlain
