import test from "ava"
import { alea, distrib } from "../../src"
import { isNonNegFract32 } from "../../src/util/number"
import { mDistrib, mMutDistrib } from "./distrib-macro"

test(
    "mutFract32",
    mMutDistrib,
    alea.mutFrom,
    distrib.mutFract32,
    isNonNegFract32
)
test("fract32", mDistrib, alea.from, distrib.fract32, isNonNegFract32)
