import { fract53, u32 } from "../src/util/number"

export const U6_TOP = 0x3f

/**
 * WARNING: due to float arithmetic imprecision,
 *      it is possible to flag some non-fract53 as fract53.
 * @param n
 * @return Is `n` a fract53?
 */
export function isNonNegFract53(n: number): n is fract53 {
    const n32bitsLess = n * 2 ** 32 - ((n * 2 ** 32) >>> 0)
    const n53bitsLess = n32bitsLess * 2 ** 21 - ((n32bitsLess * 2 ** 21) >>> 0)
    return 0 <= n && n < 1 && n53bitsLess === 0
}

/**
 * @curried
 * @param mask mask of bits (maximum value: U31_TOP)
 * @param n
 * @return Is `n` a number that fits in `mask`?
 */
export const isUx = (mask: u32) => (x: unknown): x is number => {
    return typeof x === "number" && (x & mask) === x
}

/**
 * @internal
 * @param n
 * @return Is `n` a u6?
 */
export const isU6 = isUx(U6_TOP)

export const arrayOf = <T>(guard: (x: unknown) => x is T) => (x: unknown) => {
    return (
        (Array.isArray(x) && x.every(guard)) ||
        (x instanceof Uint8Array && x.every(guard))
    )
}
