// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { fract32, fract53, i32, i54, u32 } from "./number"

const SHIFT_LEFT_22 = 2 ** 22
const SHIFT_LEFT_32 = 2 ** 32

const SHIFT_RIGHT_32 = 2 ** -32
const SHIFT_RIGHT_53 = 2 ** -53

const U22_TOP = 2 ** 22 - 1

/** @internal */
export const asU32 = (prand: fract32): u32 => (prand * SHIFT_LEFT_32) >>> 0

/** @internal */
export const asFract32 = (prand: u32): fract32 => prand * SHIFT_RIGHT_32

/** @internal */
export const asU32Between = (l: u32, excludedU: u32, prand: fract32): u32 =>
    (((prand * (excludedU - l)) >>> 0) + l) >>> 0

/** @internal */
export const asI32Between = (l: i32, excludedU: i32, prand: fract32): i32 =>
    (((prand * (excludedU - l)) >>> 0) + l) | 0

/** @internal */
export const asI54 = (prand1: fract32, prand2: fract32): i54 =>
    (asU32(prand2) | 0) * SHIFT_LEFT_22 + ((prand1 * U22_TOP) >>> 0) + 1
// -2^53 is excluded because it is not a safe integer
// Greatest: (2^31 - 1) * 2^22 + (2^22 - 2) + 1 = 2^53 - 1
// Lowest: -2^31 * 2^22 + 0 + 1 = -2^53 + 1

/** @internal */
export const asFract53 = (prand1: fract32, prand2: fract32): fract53 =>
    prand2 + (asU32(prand1) >>> 11) * SHIFT_RIGHT_53
