import { i32, u32 as u32t } from "../util/number"
import { S, smartCopy } from "./base"
import {
    mutFract32,
    mutFract53,
    mutI32Between,
    mutI54,
    mutU32,
    mutU32Array,
    mutU32Between,
    mutU8Array,
} from "./impure"

export { from, fromPlain, fromUint8Array } from "./impure"

const pureFrom = <T>(m: (g: S) => T, changeCount: u32t) => (g: S): [T, S] => {
    const copied = smartCopy(g, changeCount)
    return [m(copied), copied]
}

/**
 * @param g generator state
 * @return a random unsigned integer (32bits), and next generator state
 */
export const u32 = pureFrom(mutU32, 1)

export const i54 = pureFrom(mutI54, 2)

export const fract32 = pureFrom(mutFract32, 1)

export const fract53 = pureFrom(mutFract53, 2)

/**
 * @param l lower bound (inclusive)
 * @param exclusiveU upper bound (exclusive)
 * @return function that accepts a generator state and returns
 *      a random unsigned integer (32bits) in interval [l, exclusiveU[ with
 *      the next generator state
 */
export const u32Between = (l: u32t, exclusiveU: u32t) =>
    pureFrom(mutU32Between(l, exclusiveU), 1)

/**
 * @param l lower bound (inclusive)
 * @param exclusiveU upper bound (exclusive)
 * @return function that accepts a generator state and returns
 *      a random integer (32bits) in interval [l, exclusiveU[ with
 *      the next generator state
 */
export const i32Between = (l: i32, exclusiveU: i32) =>
    pureFrom(mutI32Between(l, exclusiveU), 1)

/**
 * @param n number of random unsigned integer (32bits) to generate
 * @return function that accepts a generator state and returns
 *      an array of {@code n} random unsigned integer (32bits) with
 *      the next generator state
 */
export const u32Array = (n: u32t) => pureFrom(mutU32Array(n), n)

/**
 * @param n number of random unsigned integer (8bits) to generate
 * @return function that accepts a generator state and returns
 *      an array of {@code n} random unsigned integer (8bits) with
 *      the next generator state
 */
export const u8Array = (n: u32t) => pureFrom(mutU8Array(n), ((n + 3) / 4) >>> 0)
