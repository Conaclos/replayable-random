// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib } from "../core/distrib"
import { ForkableMutRand, Rand } from "../core/rand"
import { ForkableMutRandFrom, RandFrom, MutRandFrom } from "../core/rand-from"
import { isObject, FromPlain } from "../util/data-validation"
import { mashes } from "../util/mash"
import { fract32, isNonNegFract32, isU32, u32 } from "../util/number"
import { asFract32, asU32Between } from "../util/number-conversion"
import { F64Array, U8Array } from "../util/typed-array"
import { add, has, U4_EMPTY_U4SET } from "../util/u4-set"
import * as alea from "./alea"
import { stringAsU8Array } from "../util/string-encoding"

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

const KYBOS_TYPE_LABEL: "kybos" = "kybos"

/**
 * Number of 32bits values for entropy
 * Must be inferior or equal to 16 because we use U4Set
 */
const ORDER = 8

/**
 * Compute the maxium number of random numbers
 * without erasing those freshly generated.
 * @param mutG [Mutated] random generator
 */
function pregenerate(mutG: Kybos): void {
    const { seeds, subprng } = mutG
    const length = seeds.length

    let phase = mutG.phase
    let bitset = U4_EMPTY_U4SET //add(U4_EMPTY_SET, phase)
    let consumable = 0
    do {
        let seed = seeds[phase] - subprng.random()
        if (seed < 0) {
            seed++
        }
        seeds[phase] = seed

        bitset = add(bitset, phase)
        phase = asU32Between(0, length, seeds[phase])
        consumable++
    } while (!has(bitset, phase))
    mutG.consumable = consumable
}

class Kybos implements ForkableMutRand, Rand {
    readonly type = KYBOS_TYPE_LABEL

    constructor(
        public subprng: ForkableMutRand,
        public seeds: F64Array, // non-negative fract32
        public phase: u32, // from 0 to seeds.length - 1
        public consumable: u32, // from 0 to seeds.length - 1
        public isShared: boolean
    ) {}

    derive<T>(d: MutDistrib<T>): [T, Rand] {
        const mutable = this.fork()
        const generated = d(mutable)
        return [generated, mutable]
    }

    fork(): Kybos {
        return new Kybos(
            this.subprng,
            this.seeds,
            this.phase,
            this.consumable,
            true
        ) // shallow copy
    }

    random(): fract32 {
        if (this.consumable === 0) {
            // All previously generated randoms were consumed.
            // Generate the next ones.
            if (this.isShared) {
                // full copy
                this.seeds = this.seeds.slice()
                this.subprng = this.subprng.fork()
                this.isShared = false
            }
            pregenerate(this)
        }

        const { seeds, phase } = this
        this.phase = asU32Between(0, seeds.length, seeds[phase])
        this.consumable--
        return seeds[phase]
    }

    toJSON(): Kybos {
        let result: Kybos = this
        if ("from" in Array) {
            // Array.from is an ES6 feature
            // If it is here, then result.seeds is certainly a typed array
            result = this.fork()
            result.seeds = Array.from(result.seeds) // turn into a regular array
        }
        return result
    }
}

const internalFromBytesUsing = (factory: ForkableMutRandFrom<U8Array>) => (
    seed: U8Array
): Kybos => {
    const subprng = factory(seed)
    const hashes = mashes(seed, ORDER)
    const seeds = new F64Array(ORDER)
    for (let i = 0; i < seeds.length; i++) {
        seeds[i] = asFract32(hashes[i])
    }
    return new Kybos(subprng, seeds, 0, 0, false)
}

/**
 * @curried
 * @param factory sub random generator to use
 * @param seed non-empty array of bytes
 * @return an immutable generator state derived from `seed`
 */
export const fromBytesUsing: (
    factory: ForkableMutRandFrom<U8Array>
) => RandFrom<U8Array> = internalFromBytesUsing

/**
 * @curried
 * @param factory sub random generator to use
 * @param seed non-empty array of bytes
 * @return a mutable generator state derived from `seed`
 */
export const mutFromBytesUsing: (
    factory: ForkableMutRandFrom<U8Array>
) => ForkableMutRandFrom<U8Array> = internalFromBytesUsing

const internalFromBytes = internalFromBytesUsing(alea.mutFromBytes)

/**
 * @param seed non-empty array of bytes
 * @return an immutable generator state derived from `seed`
 */
export const fromBytes: RandFrom<U8Array> = internalFromBytes

/**
 * @param seed non-empty array of bytes
 * @return a mutable generator state derived from `seed`
 */
export const mutFromBytes: ForkableMutRandFrom<U8Array> = internalFromBytes

const internalFromUsing = (factory: ForkableMutRandFrom<U8Array>) => (
    seed: string
): Kybos => internalFromBytesUsing(factory)(stringAsU8Array(seed))

/**
 * @curried
 * @param factory sub random generator to use
 * @param seed non-empty array of bytes
 * @return an immutable generator state derived from `seed`
 */
export const fromUsing: (
    factory: ForkableMutRandFrom<U8Array>
) => RandFrom<string> = internalFromUsing

/**
 * @curried
 * @param factory sub random generator to use
 * @param seed non-empty array of bytes
 * @return a mutable generator state derived from `seed`
 */
export const mutFromUsing: (
    factory: ForkableMutRandFrom<U8Array>
) => ForkableMutRandFrom<string> = internalFromUsing

const internalFrom = internalFromUsing(alea.mutFromBytes)

/**
 * @param seed non-empty printable ASCII string
 * @return an immutable generator state derived from `seed`
 */
export const from: RandFrom<string> = internalFrom

/**
 * @param seed non-empty printable ASCII string
 * @return a mutable generator state derived from `seed`
 */
export const mutFrom: MutRandFrom<string> = internalFrom

const internalFromPlainUsing = (factory: FromPlain<ForkableMutRand>) => (
    x: unknown
): Kybos | undefined => {
    if (
        isObject<Kybos>(x) &&
        x.type === KYBOS_TYPE_LABEL &&
        isU32(x.phase) &&
        isU32(x.consumable) &&
        x.seeds instanceof Array &&
        x.phase < x.seeds.length &&
        x.seeds.every(isNonNegFract32)
    ) {
        const subprng = factory(x.subprng)
        if (subprng !== undefined) {
            let seeds
            if ("from" in F64Array) {
                seeds = (F64Array as Float64ArrayConstructor).from(x.seeds)
            } else {
                seeds = x.seeds.slice() // ES5 fallback
            }
            return new Kybos(subprng, seeds, x.phase, x.consumable, false)
        }
    }
    return undefined
}

/**
 * @curried
 * @param factory sub random generator to use
 * @param x candidate
 * @return an immutable generator state from `x`,
 *  or undefined if `x` is mal-formed.
 */
export const fromPlainUsing: (
    factory: FromPlain<ForkableMutRand>
) => FromPlain<Rand> = internalFromPlainUsing

/**
 * @curried
 * @param factory sub random generator to use
 * @param x candidate
 * @return a mutable generator state from `x`,
 *  or undefined if `x` is mal-formed.
 */
export const mutFromPlainUsing: (
    factory: FromPlain<ForkableMutRand>
) => FromPlain<ForkableMutRand> = internalFromPlainUsing

const internalFromPlain = internalFromPlainUsing(alea.mutFromPlain)

/**
 * @experimental
 *
 * @param x candidate
 * @return an immutable generator state from `x`,
 *  or undefined if `x` is mal-formed.
 */
export const fromPlain: FromPlain<Rand> = internalFromPlain

/**
 * @experimental
 *
 * @param x candidate
 * @return a mutable generator state from `x`,
 *  or undefined if `x` is mal-formed.
 */
export const mutFromPlain: FromPlain<ForkableMutRand> = internalFromPlain
