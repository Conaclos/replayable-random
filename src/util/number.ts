// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

// Number types
export type u32 = number
export type i32 = number
export type i54 = number
export type f64 = number
export type fract32 = f64
export type fract53 = f64

// Extrenums
/** @internal */
export const U32_TOP = 2 ** 32 - 1 >>> 0

/** @internal */
export const I32_BOTTOM = - (2 ** 31) | 0

/** @internal */
export const I32_TOP = 2 ** 31 - 1 | 0

/**
 * @internal
 * @param n
 * @return Is `n' an u32?
 */
export const isU32 = (n: unknown): n is u32 =>
    typeof n === "number" && Number.isSafeInteger(n) &&
    0 <= n && n <= U32_TOP

/**
 * @internal
 * @param n
 * @return Is `n' an i32?
 */
export const isI32 = (n: unknown): n is i32 =>
    typeof n === "number" &&  Number.isSafeInteger(n) &&
    I32_BOTTOM <= n && n <= I32_TOP

const SHIFT_LEFT_32 = 2 ** 32

/**
 * WARNING: due to float arithmetic imprecision,
 *      it is possible to flag some non-fract32 as fract32.
 * @internal
 * @param n
 * @return Is `n' a fract32?
 */
export function isNonNegFract32 (n: unknown): n is fract32 {
    return typeof n === "number" && 0 <= n && n < 1 &&
        (n * SHIFT_LEFT_32 - (n * SHIFT_LEFT_32 >>> 0)) === 0
}
