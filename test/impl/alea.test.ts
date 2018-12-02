
import test from "ava"

import { isNonNegFract33 } from "../testutils"
import { sample } from "../_data/alea-sample"

import { alea } from "../../src/impl/alea"
import {
    U32_TOP, I32_BOTTOM, I32_TOP,
    isU32, isI32, isNonNegFract32,
} from "../../src/util/number"

const REPETITION_NUMBER = 300

test("alea-well-typed", (t) => {
    let g = alea.from("seed")

    for (let i = 0; i < REPETITION_NUMBER; i++) {
        t.true(isU32(alea.u32(g)[0]))
        t.true(isU32(alea.u32Between(0, U32_TOP)(g)[0]))
        t.true(isI32(alea.i32Between(I32_BOTTOM, I32_TOP)(g)[0]))
        t.true(Number.isSafeInteger(alea.i54(g)[0]))
        t.true(isNonNegFract32(alea.fract32(g)[0]))
        t.true(isNonNegFract33(alea.fract53(g)[0]))

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
        t.true(isNonNegFract32(rand.nextFract32()))
        t.true(isNonNegFract33(rand.nextFract53()))
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
    // immutable.

    let g = Object.freeze(alea.from("seed"))
    for (const expected of sample) {
        const plainCopy = JSON.parse(JSON.stringify(g))
        alea.u32(g)
        const plain = JSON.parse(JSON.stringify(g))
        t.deepEqual(plain, plainCopy)
    }
})
