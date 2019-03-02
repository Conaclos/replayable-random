// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

export interface FromPlain<T> {
    (x: unknown): T | undefined
}

/** @internal */
export type NonFunctionNames<T> = {
    [k in keyof T]: T[k] extends Function ? never : k
}[keyof T]

/** @internal */
export type Unknown<T> = { [k in NonFunctionNames<T>]?: unknown }

/**
 * @internal
 * @example
 * Given `x: unknown`
 * `isObject<{ p: number }>(x) && typeof x.p === "number"`
 * enables to test if x is conforms to `{ p: number }`.
 *
 * @param x
 * @param Is `x' a non-null object?
 */
export const isObject = <T>(x: unknown): x is Unknown<T> =>
    typeof x === "object" && x !== null

/**
 * @internal
 * @param s candidate
 * @return Is `s' a printable ASCII string?
 */
export const isPrintableASCII = (s: string): boolean =>
    /^[\x20-\x7E]*$/u.test(s)
