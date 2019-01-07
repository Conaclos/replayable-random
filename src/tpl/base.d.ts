import { fract32, u32 } from "../util/number"

export type S = { readonly type: string }

export type MutS = { type: string }

export declare function fromPlain(this: void, x: unknown): MutS | undefined

export declare function smartCopy(this: void, g: S, n: u32): MutS

export declare function mutFract32(this: void, g: MutS): fract32

export declare function fromUint8Array(this: void, seed: Uint8Array): MutS
