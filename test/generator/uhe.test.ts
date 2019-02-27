import test from "ava"
import { uhe, distrib } from "../../src/"
import * as sample from "../_data/uhe-sample.json"
import { mMutFract32, mSample, mCopyOnWrite } from "./test-macro"
import { isNonNegFract32 } from "../../src/util/number"

test(
    "uhe_mut-fract32",
    mMutFract32,
    uhe.mutFrom,
    distrib.mutFract32,
    isNonNegFract32
)

test("uhe2", mSample, uhe.mutFrom, sample)

test("uhe3", mCopyOnWrite, uhe.from)
