import test from "ava"
import { alea, distrib } from "../../src"
import { mDistrib, mMutDistrib, mArrayDistrib } from "./distrib-macro"
import { isU32 } from "../../src/util/number"

const SEED = "replayable-random-seed" // used for deterministic tests

test("mutU32", mMutDistrib, alea.mutFrom, distrib.mutU32, isU32)
test("u32", mDistrib, alea.from, distrib.u32, isU32)

test(
    "mutU32Between",
    mMutDistrib,
    alea.mutFrom,
    distrib.mutU32Between(0)(5),
    (n: number) => 0 <= n && n < 5
)
test(
    "u32Between",
    mDistrib,
    alea.from,
    distrib.u32Between(0)(5),
    (n: number) => 0 <= n && n < 5
)

test(
    "mutU32Between-equal",
    mMutDistrib,
    alea.mutFrom,
    distrib.mutU32Between(0)(1),
    (n: number) => n === 0
)
test(
    "u32Between-equal",
    mDistrib,
    alea.from,
    distrib.u32Between(0)(1),
    (n: number) => n === 0
)

test("mutU32Between-fail", (t) => {
    const mutG = alea.mutFrom(SEED)
    t.throws(() => distrib.mutU32Between(-1))
    t.throws(() => distrib.mutU32Between(0)(-1))
    t.throws(() => distrib.mutU32Between(0)(0))
})

test("u32Fill", mArrayDistrib, alea.from, distrib.u32Fill, (arr: number[]) =>
    arr.every(isU32)
)
