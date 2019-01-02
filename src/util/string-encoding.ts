// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { u32 } from "../util/number"

const nativeEncodeString = (s: string): Uint8Array =>
    new TextEncoder().encode(s)

/**
 * @internal
 * NOTE: Use TextEncoder#encode if available.
 *
 * @param s string to encode
 * @return Uint8Array containing utf-8 encoded characters of s.
 */
export function encodeString(s: string): Uint8Array {
    const result = new Uint8Array(s.length)
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
 * @return Uint8Array containing utf-8 encoded characters of s.
 */
export const stringAsUint8Array: (s: string) => Uint8Array = (() => {
    if (
        typeof TextEncoder === "function" &&
        typeof TextEncoder.prototype.encode === "function"
    ) {
        return nativeEncodeString
    } else {
        return encodeString
    }
})()
