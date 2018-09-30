
import test from "ava"

import { isU32, isI32, isNonNegativeFract32, isNonNegativeFract33 } from "../testutils"

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

    const expectedStream = Uint32Array.of(
        149261188, 2487070486, 2602347448, 3645231185,
        2120325931, 446987717, 163591728, 3246687600,
        4166470180, 3384042145, 1059298884, 885817093,
        2527000796, 311287600, 3637279863, 1980324706,
        1423402627, 3275616637, 2094667232, 3183483938
    )

    for (const expected of expectedStream) {
        t.is(rand.nextU32(), expected)
    }
})
