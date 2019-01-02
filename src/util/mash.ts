// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { f64, u32 } from "./number"
import { asFract32, asU32 } from "./number-conversion"

const SPACE_CHAR_CODE = 32
export const DEFAULT_MASH_INPUT = Uint8Array.of(SPACE_CHAR_CODE)
export const DEFAULT_MASH_N = 0xefc8_249d

/**
 * Based on Johannes Baagoe's hash function.
 * See http://baagoe.com/en/RandomMusings/hash/avalanche.xhtml for more details.
 * 2012-01-02 snapshot: https://web.archive.org/web/20120102175211/baagoe.com/en/RandomMusings/hash/avalanche.xhtml
 *
 * The function has a proven "avalanche effect":
 * every bit of the input affects every bit of the output 50% of the time.
 * Thus, the change of a single bit strongly affects the output in a haphazard way.
 *
 * Original implementation can be found at http://baagoe.org:80/en/wiki/Mash
 * 2012-03-03 snapshot: https://web.archive.org/web/20120629135640/http://baagoe.org:80/en/wiki/Mash
 *
 * This implementation differs of the original one in several aspects:
 * - The function is pure: the internal state is now the parameter n.
 * - The input must be a Uint8Array instead of a string.
 * - The output is an unisgned integer 32 instead of a fract32.
 *
 * Usage:
 * const h1 = mash(DEFAULT_MASH_N, DEFAULT_MASH_INPUT)
 * const h2 = mash(h1, data)
 *
 * @param n internal state
 * @param input
 * @return hash (can also be used as the next internal state)
 */
export const mash = (n: f64, input: Uint8Array): f64 => {
    const inputLength = input.length
    for (let i = 0; i < inputLength; i++) {
        n = n + input[i]
        let h: f64 = 0.02519603282416938 * n
        n = h >>> 0
        h = h - n
        h = h * n
        n = h >>> 0
        h = h - n
        n = n + asU32(h)
    }
    return n
}

/**
 * Derive a specified number of hashes (encoded as u32) from a given input.
 * Based on mash function.
 *
 * @param input
 * @param count number of hashes to derive
 * @return Array of unsigned integer 32bits
 */
export const mashes = (input: Uint8Array, count: u32): Uint32Array => {
    const result = new Uint32Array(count)
    let prev = DEFAULT_MASH_N
    for (let i = 0; i < count; i++) {
        prev = mash(prev, DEFAULT_MASH_INPUT)
        result[i] = prev >>> 0
    }
    for (let i = 0; i < count; i++) {
        prev = mash(prev, input)
        const v = prev >>> 0
        if (result[i] >= v) {
            result[i] = result[i] - v
        } else {
            result[i] = asU32(asFract32(result[i] - v) + 1)
        }
    }
    return result
}
