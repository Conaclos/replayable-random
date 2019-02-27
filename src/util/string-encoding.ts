// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { U8Array } from "./typed-array"

const nativeEncodeString = (s: string): Uint8Array =>
    new TextEncoder().encode(s)

/**
 * @internal
 * NOTE: Use TextEncoder#encode if available.
 *
 * @param s string to encode
 * @return array containing utf-8 encoded characters of s.
 */
export const encodeString = (s: string): U8Array => {
    const result = new U8Array(s.length)
    for (let i = 0; i < s.length; i++) {
        result[i] = s.charCodeAt(i)
    }
    return result
}

/**
 * @internal
 * Encode a string as a Uint8Array with native encoder if available or
 * using teh function encodeString.
 *
 * @param s string to encode
 * @return array containing utf-8 encoded characters of s.
 */
export const stringAsU8Array: (s: string) => U8Array =
    typeof TextEncoder === "function" ? nativeEncodeString : encodeString
