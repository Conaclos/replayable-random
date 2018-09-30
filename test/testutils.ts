
import { u32, i32, fract32, fract53, U32_TOP, I32_BOTTOM, I32_TOP  } from "../src/util/number"

/**
 * @param n
 * @return Is `n' an u32?
 */
export function isU32 (n: number): n is u32 {
    return Number.isSafeInteger(n) && 0 <= n && n <= U32_TOP
}

/**
 * @param n
 * @return Is `n' an i32?
 */
export function isI32 (n: number): n is i32 {
    return Number.isSafeInteger(n) && I32_BOTTOM <= n && n <= I32_TOP
}

/**
 * WARNING: due to float arithmetic imprecision,
 *      it is possible to flag some non-fract32 as fract32.
 * @param n
 * @return Is `n' a fract32?
 */
export function isNonNegativeFract32 (n: number): n is fract32 {
    const n32bitsLess = (n * 2 ** 32 - (n * 2 ** 32 >>> 0))
    return 0 <= n && n < 1 && n32bitsLess === 0
}

/**
 * WARNING: due to float arithmetic imprecision,
 *      it is possible to flag some non-fract32 as fract53.
 * @param n
 * @return Is `n' a fract53?
 */
export function isNonNegativeFract33 (n: number): n is fract53 {
    const n32bitsLess = n * 2 ** 32 - (n * 2 ** 32 >>> 0)
    const n53bitsLess = n32bitsLess * 2 ** 21 - (n32bitsLess * 2 ** 21 >>> 0)
    return 0 <= n && n < 1 && n53bitsLess === 0
}
