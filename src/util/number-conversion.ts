// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { i32, u32, i54, fract32, fract53, I32_BOTTOM } from "./number"

const SHIFT_LEFT_22 = 2 ** 22
const SHIFT_LEFT_32 = 2 ** 32

const SHIFT_RIGHT_32 = 2 ** -32
const SHIFT_RIGHT_53 = 2 ** -53

const U22_TOP = 2 ** 22 - 1

export const asU32 = (prand: fract32 | fract53): u32 =>
    prand * SHIFT_LEFT_32 >>> 0

export const asFract32 = (prand: u32 | i32): fract32 =>
    prand * SHIFT_RIGHT_32

export const asI32 = (prand: u32): i32 => prand | 0

export const asU32Between = (l: u32, exclusiveU: u32, prand: fract32 | fract53): u32 =>
    (prand * (exclusiveU - l) >>> 0) + l >>> 0

export const asI32Between = (l: i32, exclusiveU: i32, prand: fract32 | fract53): i32 =>
    ((prand * (exclusiveU - l)) >>> 0) + l | 0

export const asI54 = (prand1: fract32, prand2: u32): i54 =>
    (prand2 | 0) * SHIFT_LEFT_22 + (prand1 * U22_TOP >>> 0) + 1
        // -2^53 is excluded because it is not a safe integer
        // Greatest: (2^31 - 1) * 2^22 + (2^22 - 2) + 1 = 2^53 - 1
        // Lowest: -2^31 * 2^22 + 0 + 1 = -2^53 + 1

export const asFract53 = (prand1: u32, prand2: fract32): fract53 =>
    prand2 + ((prand1 >>> 11) * SHIFT_RIGHT_53)
