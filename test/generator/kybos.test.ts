import test from "ava"
import { kybos, distrib } from "../../src/"
import * as sample from "../_data/kybos-sample.json"
import { mMutFract32, mSample, mCopyOnWrite } from "./test-macro"
import { isNonNegFract32 } from "../../src/util/number"

test(
    "kybos_mut-fract32",
    mMutFract32,
    kybos.mutFrom,
    distrib.mutFract32,
    isNonNegFract32
)

test("kybos2", mSample, kybos.mutFrom, sample)

test("kybos3", mCopyOnWrite, kybos.from)
