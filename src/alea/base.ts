import { isObject } from "../util/data-validation"
import { mashes } from "../util/mash"
import { f64, fract32, i32, isI32, isNonNegFract32 } from "../util/number"
import { asFract32 } from "../util/number-conversion"

export const ALEA_TYPE_LABEL: "alea" = "alea"

export interface MutAleaState {
    readonly type: typeof ALEA_TYPE_LABEL
    carry: i32 // non-negative
    seed0: fract32 // non-negative
    seed1: fract32 // non-negative
    seed2: fract32 // non-negative
}

export type AleaState = Readonly<MutAleaState>

/**
 * Carefully chosen prime number.
 * Must be less that 2^21, in order to ensure that the
 * result of the multiplication fits in 53bits (JavaScript bound).
 */
const MULTIPLIER = 2_091_639

const INITIAL_CARRY = 1

export function nextFract32(this: MutAleaState): fract32 {
    const t: f64 = MULTIPLIER * this.seed0 + asFract32(this.carry)
    this.carry = t | 0
    // seeds' rotation
    this.seed0 = this.seed1
    this.seed1 = this.seed2
    this.seed2 = t - this.carry // new computed seed
    return this.seed2
}

export const smartCopy = (g: AleaState): MutAleaState => {
    return {
        type: ALEA_TYPE_LABEL,
        carry: g.carry,
        seed0: g.seed0,
        seed1: g.seed1,
        seed2: g.seed2,
    } // Do not use object spreading. Emitted helper hurts perfs.
}

export const fromUint8Array = (seed: Uint8Array): MutAleaState => {
    const hashes = mashes(seed, 3)
    const seed0 = asFract32(hashes[0])
    const seed1 = asFract32(hashes[1])
    const seed2 = asFract32(hashes[2])
    return {
        type: ALEA_TYPE_LABEL,
        carry: INITIAL_CARRY,
        seed0,
        seed1,
        seed2,
    }
}

export const fromPlain = (x: unknown): MutAleaState | undefined => {
    if (
        isObject<AleaState>(x) &&
        x.type === ALEA_TYPE_LABEL &&
        isI32(x.carry) &&
        x.carry > 0 &&
        isNonNegFract32(x.seed0) &&
        isNonNegFract32(x.seed1) &&
        isNonNegFract32(x.seed2)
    ) {
        return {
            type: ALEA_TYPE_LABEL,
            carry: x.carry,
            seed0: x.seed0,
            seed1: x.seed1,
            seed2: x.seed2,
        }
    }
    return undefined
}
