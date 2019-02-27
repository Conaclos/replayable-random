// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { u32, u4 } from "./number"

/**
 * Set of 4bits unsigned integers (hexadecimal digits)
 * @internal
 */
export type U4Set = u32

/**
 * Empty set
 * @internal
 */
export const U4_EMPTY_SET = 0

/** @internal */
export function has(s: U4Set, n: u4): boolean {
    const pos = 0b1 << n
    return (s & pos) !== 0
}

/** @internal */
export function add(s: U4Set, n: u4): U4Set {
    const pos = 0b1 << n
    return s | pos
}
