
import test from "ava"

import { isNonNegFract33 } from "../testutils"
import { sample } from "../_data/kybos-sample"

import { kybos } from "../../src/impl/kybos"
import {
    U32_TOP, I32_BOTTOM, I32_TOP,
    isU32, isI32, isNonNegFract32,
} from "../../src/util/number"

const REPETITION_NUMBER = 300

test("kybos-well-typed", (t) => {
    let g = kybos.from("seed")

    for (let i = 0; i < REPETITION_NUMBER; i++) {
        t.true(isU32(kybos.u32(g)[0]))
        t.true(isU32(kybos.u32Between(0, U32_TOP)(g)[0]))
        t.true(isI32(kybos.i32Between(I32_BOTTOM, I32_TOP)(g)[0]))
        t.true(Number.isSafeInteger(kybos.i54(g)[0]))
        t.true(isNonNegFract32(kybos.fract32(g)[0]))
        t.true(isNonNegFract33(kybos.fract53(g)[0]))

        g = kybos.fract32(g)[1]
    }
})

test("mut-kybos-well-typed", (t) => {
    const rand = kybos.streamFrom("seed")

    for (let i = 0; i < REPETITION_NUMBER; i++) {
        t.true(isU32(rand.nextU32()))
        t.true(isU32(rand.nextU32Between(0, U32_TOP)))
        t.true(isI32(rand.nextI32Between(I32_BOTTOM, I32_TOP)))
        t.true(Number.isSafeInteger(rand.nextI54()))
        t.true(isNonNegFract32(rand.nextFract32()))
        t.true(isNonNegFract33(rand.nextFract53()))
    }
})

test("kybos-is-deterministic", (t) => {
    const rand = kybos.streamFrom("seed")

    for (const expected of sample) {
        t.is(rand.nextU32(), expected)
    }
})

test("kybos-proper-copy-on-write", (t) => {
    // The purpose of this test is to detect changes on state which should be
    // immutable.

    let g = kybos.from("seed")
    for (const expected of sample) {
        const plainCopy = JSON.parse(JSON.stringify(g))
        const res = kybos.u32(g)
        const plain = JSON.parse(JSON.stringify(g))
        t.deepEqual(plain, plainCopy)
        g = res[1]
    }
})

test("kybos-from-plain", (t) => {
    const rand = kybos.streamFrom("seed")
    for (let i = 0; i < REPETITION_NUMBER; i++) {
        t.truthy(kybos.fromPlain(rand))
        t.truthy(kybos.fromPlain(JSON.parse(JSON.stringify(rand))))
        rand.nextU32()
    }
})
