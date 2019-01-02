import { Macro } from "ava"
import { Random } from "../../src"
import {
    I32_BOTTOM,
    I32_TOP,
    isI32,
    isNonNegFract32,
    isU32,
    u32,
    U32_TOP,
} from "../../src/util/number"
import { isNonNegFract33 } from "../testutils"

// Every macro should start with the letter 'm'

const REPETITION_NUMBER = 300

const macro = <MA extends unknown[]>(macroTitle: string, m: Macro<MA>) => {
    m.title = (rngName = "rng", ...args: MA) => `${rngName}_${macroTitle}`
    return m
}

export const mWellTypedStream = <T>(rng: Random<T>) =>
    macro("well-typed-stream", (t) => {
        const rand = rng.streamFrom("seed")
        for (let i = 0; i < REPETITION_NUMBER; i++) {
            t.true(isU32(rand.nextU32()))
            t.true(isU32(rand.nextU32Between(0, U32_TOP)))
            t.true(isI32(rand.nextI32Between(I32_BOTTOM, I32_TOP)))
            t.true(Number.isSafeInteger(rand.nextI54()))
            t.true(isNonNegFract32(rand.nextFract32()))
            t.true(isNonNegFract33(rand.nextFract53()))
        }
    })

export const mWellTyped = <T>(rng: Random<T>) =>
    macro("sell-typed", (t) => {
        let g = rng.from("seed")
        for (let i = 0; i < REPETITION_NUMBER; i++) {
            t.true(isU32(rng.u32(g)[0]))
            t.true(isU32(rng.u32Between(0, U32_TOP)(g)[0]))
            t.true(isI32(rng.i32Between(I32_BOTTOM, I32_TOP)(g)[0]))
            t.true(Number.isSafeInteger(rng.i54(g)[0]))
            t.true(isNonNegFract32(rng.fract32(g)[0]))
            t.true(isNonNegFract33(rng.fract53(g)[0]))
            g = rng.fract32(g)[1]
        }
    })

export type Sample = { seed: string; values: u32[] }

export const mSample = <T>(rng: Random<T>) =>
    macro("sample-matching", (t, s: Sample) => {
        const rand = rng.streamFrom(s.seed)
        for (const expected of s.values) {
            t.is(rand.nextU32(), expected)
        }
    })

export const mCopyOnWrite = <T>(rng: Random<T>) =>
    macro("copy-on-write", (t, s: Sample) => {
        // The purpose of this test is to detect changes on state which should be
        // imnextable.

        let g = rng.from(s.seed)
        for (const expected of s.values) {
            const plainCopy = JSON.parse(JSON.stringify(g))
            const res = rng.u32(g)
            const plain = JSON.parse(JSON.stringify(g))
            t.deepEqual(plain, plainCopy)
            g = res[1]
        }
    })

export const mFromPlain = <T>(rng: Random<T>) =>
    macro("from-plain", (t) => {
        const rand = rng.streamFrom("seed")
        for (let i = 0; i < REPETITION_NUMBER; i++) {
            t.truthy(rng.fromPlain(rand))
            t.truthy(rng.fromPlain(JSON.parse(JSON.stringify(rand))))
            rand.nextU32()
        }
    })
