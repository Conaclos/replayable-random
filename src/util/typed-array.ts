// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

export type U8Array = Uint8Array | Array<number>
export type U16Array = Uint16Array | Array<number>
export type U32Array = Uint32Array | Array<number>
export type I8Array = Int8Array | Array<number>
export type I16Array = Int16Array | Array<number>
export type I32Array = Int32Array | Array<number>
export type F32Array = Float32Array | Array<number>
export type F64Array = Float64Array | Array<number>

export const U8Array: Uint8ArrayConstructor | ArrayConstructor =
    Uint8Array || Array
export const U16Array: Uint16ArrayConstructor | ArrayConstructor =
    Uint16Array || Array
export const U32Array: Uint32ArrayConstructor | ArrayConstructor =
    Uint32Array || Array
export const I8Array: Int8ArrayConstructor | ArrayConstructor =
    Int8Array || Array
export const I16Array: Int16ArrayConstructor | ArrayConstructor =
    Int16Array || Array
export const I32Array: Int32ArrayConstructor | ArrayConstructor =
    Int32Array || Array
export const F32Array: Float32ArrayConstructor | ArrayConstructor =
    Float32Array || Array
export const F64Array: Float64ArrayConstructor | ArrayConstructor =
    Float64Array || Array

/**
 * ES5 fallback of `Array.from`
 */
export const arrayFromFallback = <T>(a: ArrayLike<T>): T[] => {
    const len = a.length
    const result = new Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = a[i]
    }
    return result
}

export const arrayFrom = Array.from || arrayFromFallback
