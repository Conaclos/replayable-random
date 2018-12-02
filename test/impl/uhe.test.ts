
import test from "ava"

import { isNonNegFract33 } from "../testutils"
import { sample } from "../_data/uhe-sample"

import { uhe } from "../../src/impl/uhe"
import {
    U32_TOP, I32_BOTTOM, I32_TOP,
    isU32, isI32, isNonNegFract32,
} from "../../src/util/number"

const REPETITION_NUMBER = 300

test("uhe-well-typed", (t) => {
    let g = uhe.from("seed")

    for (let i = 0; i < REPETITION_NUMBER; i++) {
        t.true(isU32(uhe.u32(g)[0]))
        t.true(isU32(uhe.u32Between(0, U32_TOP)(g)[0]))
        t.true(isI32(uhe.i32Between(I32_BOTTOM, I32_TOP)(g)[0]))
        t.true(Number.isSafeInteger(uhe.i54(g)[0]))
        t.true(isNonNegFract32(uhe.fract32(g)[0]))
        t.true(isNonNegFract33(uhe.fract53(g)[0]))

        g = uhe.fract32(g)[1]
    }
})

test("mut-uhe-well-typed", (t) => {
    const rand = uhe.streamFrom("seed")

    for (let i = 0; i < REPETITION_NUMBER; i++) {
        t.true(isU32(rand.nextU32()))
        t.true(isU32(rand.nextU32Between(0, U32_TOP)))
        t.true(isI32(rand.nextI32Between(I32_BOTTOM, I32_TOP)))
        t.true(Number.isSafeInteger(rand.nextI54()))
        t.true(isNonNegFract32(rand.nextFract32()))
        t.true(isNonNegFract33(rand.nextFract53()))
    }
})

test("uhe-is-deterministic", (t) => {
    const rand = uhe.streamFrom("seed")

    for (const expected of sample) {
        t.is(rand.nextU32(), expected)
    }
})

test("uhe-proper-copy-on-write", (t) => {
    // The purpose of this test is to detect changes on state which should be
    // immutable.

    let g = Object.freeze(uhe.from("seed"))
    for (const expected of sample) {
        const plainCopy = JSON.parse(JSON.stringify(g))
        uhe.u32(g)
        const plain = JSON.parse(JSON.stringify(g))
        t.deepEqual(plain, plainCopy)
    }
})
