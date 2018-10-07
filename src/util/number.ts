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
