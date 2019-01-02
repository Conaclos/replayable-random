import test from "ava"
import { I32_BOTTOM, I32_TOP, U32_TOP } from "../../src/util/number"
import {
    asI32,
    asI32Between,
    asI54,
    asU32,
    asU32Between,
} from "../../src/util/number-conversion"

const U32_MID = 2 ** 31

const FRACT32_MID = U32_MID * 2 ** -32
const FRACT32_TOP = U32_TOP * 2 ** -32

test("asU32", (t) => {
    t.is(asU32(0), 0)
    t.is(asU32(FRACT32_MID), U32_MID)
    t.is(asU32(FRACT32_TOP), U32_TOP)
})

test("asI32", (t) => {
    t.is(asI32(0), 0)
    t.is(asI32(I32_TOP), I32_TOP)
    t.is(asI32(U32_MID), I32_BOTTOM)
})

test("asI54", (t) => {
    t.is(asI54(0, U32_MID), Number.MIN_SAFE_INTEGER)
    t.is(asI54(0, 0), 1)
    t.is(asI54(FRACT32_TOP, I32_TOP), Number.MAX_SAFE_INTEGER)
})

test("asU32Between", (t) => {
    t.is(asU32Between(0, U32_TOP, 0), 0)
    // U32_X - 1 because U32_TOP is excluded
    t.is(asU32Between(0, U32_TOP, FRACT32_MID), U32_MID - 1)
    t.is(asU32Between(0, U32_TOP, FRACT32_TOP), U32_TOP - 1)
})

test("asU32Between-unit-interval", (t) => {
    t.is(asU32Between(0, 1, 0), 0)
    t.is(asU32Between(0, 1, FRACT32_MID), 0)
    t.is(asU32Between(0, 1, FRACT32_TOP), 0)

    t.is(asU32Between(U32_MID, U32_MID + 1, 0), U32_MID)
    t.is(asU32Between(U32_MID, U32_MID + 1, FRACT32_MID), U32_MID)
    t.is(asU32Between(U32_MID, U32_MID + 1, FRACT32_TOP), U32_MID)

    t.is(asU32Between(U32_TOP - 1, U32_TOP, 0), U32_TOP - 1)
    t.is(asU32Between(U32_TOP - 1, U32_TOP, FRACT32_MID), U32_TOP - 1)
    t.is(asU32Between(U32_TOP - 1, U32_TOP, FRACT32_TOP), U32_TOP - 1)
})

test("asI32Between", (t) => {
    t.is(asI32Between(I32_BOTTOM, I32_TOP, 0), I32_BOTTOM)
    // U32_X - 1 because U32_TOP is excluded
    t.is(asI32Between(I32_BOTTOM, I32_TOP, FRACT32_MID), -1)
    t.is(asI32Between(I32_BOTTOM, I32_TOP, FRACT32_TOP), I32_TOP - 1)
})

test("asI32Between-unit-interval", (t) => {
    t.is(asI32Between(I32_BOTTOM, I32_BOTTOM + 1, 0), I32_BOTTOM)
    t.is(asI32Between(I32_BOTTOM, I32_BOTTOM + 1, FRACT32_MID), I32_BOTTOM)
    t.is(asI32Between(I32_BOTTOM, I32_BOTTOM + 1, FRACT32_TOP), I32_BOTTOM)

    t.is(asI32Between(-1, 0, 0), -1)
    t.is(asI32Between(-1, 0, FRACT32_MID), -1)
    t.is(asI32Between(-1, 0, FRACT32_TOP), -1)

    t.is(asI32Between(0, 1, 0), 0)
    t.is(asI32Between(0, 1, FRACT32_MID), 0)
    t.is(asI32Between(0, 1, FRACT32_TOP), 0)

    t.is(asI32Between(I32_TOP - 1, I32_TOP, 0), I32_TOP - 1)
    t.is(asI32Between(I32_TOP - 1, I32_TOP, FRACT32_MID), I32_TOP - 1)
    t.is(asI32Between(I32_TOP - 1, I32_TOP, FRACT32_TOP), I32_TOP - 1)
})
