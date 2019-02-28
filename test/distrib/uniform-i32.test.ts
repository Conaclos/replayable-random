import test from "ava"
import { alea, distrib } from "../../src"
import { mDistrib, mMutDistrib, mArrayDistrib } from "./distrib-macro"
import { isI32 } from "../../src/util/number"

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

test("i32Fill", mArrayDistrib, alea.from, distrib.i32Fill, (arr: number[]) =>
    arr.every(isI32)
)
