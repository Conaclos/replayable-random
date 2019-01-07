import { fract53, i32, i54, u32 } from "../util/number"
import {
    asFract53,
    asI32Between,
    asI54,
    asU32Between,
    asU32,
} from "../util/number-conversion"
import { fromPlain, fromUint8Array, mutFract32, MutS } from "./base"
import { stringAsUint8Array } from "../util/string-encoding"
import { TypeableArray } from "../util/typed-array"

export { fromPlain, fromUint8Array }

export const from = (seed: string): MutS =>
    fromUint8Array(stringAsUint8Array(seed))

export { mutFract32 }

export const mutU32 = (g: MutS): u32 => asU32(mutFract32(g))

export const mutI54 = (g: MutS): i54 => asI54(mutFract32(g), mutU32(g))

export const mutU32Between = (l: u32, exclusiveU: u32) => (g: MutS): u32 =>
    asU32Between(l, exclusiveU, mutFract32(g))

export const mutI32Between = (l: i32, exclusiveU: i32) => (g: MutS): i32 =>
    asI32Between(l, exclusiveU, mutFract32(g))

export const mutFract53 = (g: MutS): fract53 =>
    asFract53(mutU32(g), mutFract32(g))

const mutFill = <E, T>(m: (g: T) => E, result: TypeableArray<E>) => (g: T) => {
    for (let i = 0; i < result.length; i++) {
        result[i] = m(g)
    }
    return result
}
const fill = <E, T, U extends TypeableArray<E>>(m: (g: T) => E, result: U) => (
    g: T
): U => {
    for (let i = 0; i < result.length; i++) {
        result[i] = m(g)
    }
    return result
}

const mutI32 = (g: MutS) => mutU32(g) | 0
const mutI16 = mutI32Between(-(2 ** 15) | 0, (2 ** 15 - 1) | 0)
const mutI8 = mutI32Between(-(2 ** 7) | 0, (2 ** 7 - 1) | 0)

export const mutU32Array = (n: u32) => fill(mutU32, new Uint32Array(n))

export const mutU16Array = (n: u32) => (g: MutS): Uint16Array => {
    const u32Count = ((n + 1) / 2) >>> 0
    const u32Array = mutU32Array(u32Count)(g)
    return new Uint16Array(u32Array.buffer)
}

export const mutU8Array = (n: u32) => (g: MutS): Uint8Array => {
    const u32Count = ((n + 3) / 4) >>> 0
    const u32Array = mutU32Array(u32Count)(g)
    return new Uint8Array(u32Array.buffer)
}

export const mutI32Array = (n: u32) => fill(mutU32, new Int32Array(n))

export const mutI16Array = (n: u32) => (g: MutS): Int16Array => {
    const u32Count = ((n + 1) / 2) >>> 0
    const u32Array = mutU32Array(u32Count)(g)
    return new Int16Array(u32Array.buffer)
}

export const mutI8Array = (n: u32) => (g: MutS): Int8Array => {
    const u32Count = ((n + 3) / 4) >>> 0
    const u32Array = mutU32Array(u32Count)(g)
    return new Int8Array(u32Array.buffer)
}
