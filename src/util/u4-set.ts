// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { u32, u4 } from "./number"

/**
 * @internal
 * Set of 4bits unsigned integers (hexadecimal digits)
 */
export type U4Set = u32

/**
 * @internal
 * Empty set
 */
export const U4_EMPTY_U4SET = 0

/**
 * @internal
 * @param s set
 * @param n
 * @param Is `n` in `s`?
 */
export function has(s: U4Set, n: u4): boolean {
    const pos = 0b1 << n
    return (s & pos) !== 0
}

/**
 * @internal
 * @param s set
 * @param n
 * @return new set that adds `n` to `s`
 */
export function add(s: U4Set, n: u4): U4Set {
    const pos = 0b1 << n
    return s | pos
}
