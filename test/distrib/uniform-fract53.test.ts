import test from "ava"
import { alea, distrib } from "../../src"
import { isNonNegFract53 } from "../testutils"
import { mDistrib, mMutDistrib } from "./distrib-macro"

test(
    "mutFract53",
    mMutDistrib,
    alea.mutFrom,
    distrib.mutFract53,
    isNonNegFract53
)
test("fract53", mDistrib, alea.from, distrib.fract53, isNonNegFract53)
