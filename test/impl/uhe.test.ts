
import test from "ava"

import { isU32, isI32, isNonNegativeFract32, isNonNegativeFract33 } from "../testutils"

import { uhe } from "../../src/impl/uhe"
import { U32_TOP, I32_BOTTOM, I32_TOP } from "../../src/util/number"

const REPETITION_NUMBER = 300

test("uhe-well-typed", (t) => {
    let g = uhe.from("seed")

    for (let i = 0; i < REPETITION_NUMBER; i++) {
        t.true(isU32(uhe.u32(g)[0]))
        t.true(isU32(uhe.u32Between(0, U32_TOP)(g)[0]))
        t.true(isI32(uhe.i32Between(I32_BOTTOM, I32_TOP)(g)[0]))
        t.true(Number.isSafeInteger(uhe.i54(g)[0]))
        t.true(isNonNegativeFract32(uhe.fract32(g)[0]))
        t.true(isNonNegativeFract33(uhe.fract53(g)[0]))

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
        t.true(isNonNegativeFract32(rand.nextFract32()))
        t.true(isNonNegativeFract33(rand.nextFract53()))
    }
})

test("uhe-is-deterministic", (t) => {
    const rand = uhe.streamFrom("seed")

    const expectedStream = Uint32Array.of(
        1975804156, 2112430862, 2446796506, 4206307178,
        1456543323, 4011525091, 2845328503, 593982652,
        3838310559, 2925522420, 1418533361, 3622803603,
        1802007846, 2364178472, 393601146, 2640450475,
        179598546, 3465410557, 3962719202, 1879926770,
    )

    for (const expected of expectedStream) {
        t.is(rand.nextU32(), expected)
    }
})
