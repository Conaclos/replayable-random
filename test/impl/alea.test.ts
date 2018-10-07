
import test from "ava"

import { isU32, isI32, isNonNegativeFract32, isNonNegativeFract33 } from "../testutils"
import { sample } from "../_data/alea-sample"

import { alea } from "../../src/impl/alea"
import { U32_TOP, I32_BOTTOM, I32_TOP } from "../../src/util/number"

const REPETITION_NUMBER = 300

test("alea-well-typed", (t) => {
    let g = alea.from("seed")

    for (let i = 0; i < REPETITION_NUMBER; i++) {
        t.true(isU32(alea.u32(g)[0]))
        t.true(isU32(alea.u32Between(0, U32_TOP)(g)[0]))
        t.true(isI32(alea.i32Between(I32_BOTTOM, I32_TOP)(g)[0]))
        t.true(Number.isSafeInteger(alea.i54(g)[0]))
        t.true(isNonNegativeFract32(alea.fract32(g)[0]))
        t.true(isNonNegativeFract33(alea.fract53(g)[0]))

        g = alea.fract32(g)[1]
    }
})

test("mut-alea-well-typed", (t) => {
    const rand = alea.streamFrom("seed")

    for (let i = 0; i < REPETITION_NUMBER; i++) {
        t.true(isU32(rand.nextU32()))
        t.true(isU32(rand.nextU32Between(0, U32_TOP)))
        t.true(isI32(rand.nextI32Between(I32_BOTTOM, I32_TOP)))
        t.true(Number.isSafeInteger(rand.nextI54()))
        t.true(isNonNegativeFract32(rand.nextFract32()))
        t.true(isNonNegativeFract33(rand.nextFract53()))
    }
})

test("alea-is-deterministic", (t) => {
    const rand = alea.streamFrom("seed")

    for (const expected of sample) {
        t.is(rand.nextU32(), expected)
    }
})

test("alea-proper-copy-on-write", (t) => {
    // The purpose of this test is to detect changes on state which should be
    // immutable. We prevent modifications on these objetcs. By preventing
    // modifications, the sequence of generated randoms is no longer correct.

    let g = Object.freeze(alea.from("seed"))
    for (const expected of sample) {
        const res = alea.u32(g)

        t.is(res[0], expected)

        g = Object.freeze(res[1])
    }
})
