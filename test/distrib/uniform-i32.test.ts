import test from "ava"
import { alea, distrib } from "../../src"
import { mDistrib, mMutDistrib, mArrayDistrib } from "./distrib-macro"
import { isI32, U32_TOP } from "../../src/util/number"

const SEED = "replayable-random-seed" // used for deterministic tests

test("mutI32", mMutDistrib, alea.mutFrom, distrib.mutI32, isI32)
test("i32", mDistrib, alea.from, distrib.i32, isI32)

test(
    "mutI32Between",
    mMutDistrib,
    alea.mutFrom,
    distrib.mutI32Between(-4)(5),
    (n: number) => -4 <= n && n < 5
)
test(
    "i32Between",
    mDistrib,
    alea.from,
    distrib.i32Between(-4)(5),
    (n: number) => -4 <= n && n < 5
)

test(
    "mutI32Between-equal",
    mMutDistrib,
    alea.mutFrom,
    distrib.mutI32Between(-1)(0),
    (n: number) => n === -1
)
test(
    "i32Between-equal",
    mDistrib,
    alea.from,
    distrib.i32Between(-1)(0),
    (n: number) => n === -1
)

test("mutI32Between-fail", (t) => {
    const mutG = alea.mutFrom(SEED)
    t.throws(() => distrib.mutI32Between(U32_TOP))
    t.throws(() => distrib.mutI32Between(0)(U32_TOP))
    t.throws(() => distrib.mutU32Between(0)(0))
})

test("i32Fill", mArrayDistrib, alea.from, distrib.i32Fill, (arr: number[]) =>
    arr.every(isI32)
)
