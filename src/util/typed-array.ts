// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { isObject } from "./data-validation"

/**
 * @internal
 *
 * Construct a typed / untyped array from a typed / untyped array, or an object
 * with index as properties. This last case is useful to recover a
 * typed array from its JSON representation.
 *
 * @param x
 * @param factory
 * @param itemGuard
 * @return typed array from `x'
 */
export function arayFrom<T extends TypeableArray<number>>(
    x: { [i: number]: unknown },
    factory: TypeableArrayFactory<number, T>,
    itemGuard: (y: unknown) => y is number
): T {
    if (
        (Array.isArray(x) ||
            x instanceof Uint8ClampedArray ||
            x instanceof Uint8Array ||
            x instanceof Uint16Array ||
            x instanceof Uint32Array ||
            x instanceof Int8Array ||
            x instanceof Int16Array ||
            x instanceof Int32Array ||
            x instanceof Float32Array ||
            x instanceof Float64Array) &&
        (x as TypeableArray<number>).every(itemGuard)
    ) {
        return factory.from(x)
    } else {
        const array: number[] = []
        let i = 0
        let e = x[i]
        while (itemGuard(e)) {
            array[i] = e
            i++
            e = x[i]
        }
        return factory.from(array)
    }
}
