import test from "ava"
import { alea, distrib } from "../../src/"
import * as sample from "../_data/alea-sample.json"
import { mCopyOnWrite, mMutFract32, mSample } from "./test-macro"
import { isNonNegFract32 } from "../../src/util/number"

test(
    "alea_mut-fract32",
    mMutFract32,
    alea.mutFrom,
    distrib.mutFract32,
    isNonNegFract32
)

test("alea2", mSample, alea.mutFrom, sample)

test("alea3", mCopyOnWrite, alea.from)
