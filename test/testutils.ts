
import { fract53 } from "../src/util/number"

/**
 * WARNING: due to float arithmetic imprecision,
 *      it is possible to flag some non-fract53 as fract53.
 * @param n
 * @return Is `n' a fract53?
 */
export function isNonNegFract33 (n: number): n is fract53 {
    const n32bitsLess = n * 2 ** 32 - (n * 2 ** 32 >>> 0)
    const n53bitsLess = n32bitsLess * 2 ** 21 - (n32bitsLess * 2 ** 21 >>> 0)
    return 0 <= n && n < 1 && n53bitsLess === 0
}
