
import test from "ava"
import { uhe } from "../../src/"
import * as SAMPLE from "../_data/uhe-sample.json"
import { mCopyOnWrite, mFromPlain, mSample, mWellTyped, mWellTypedStream } from "./test-macro"

test("uhe", mWellTypedStream(uhe))

test("uhe", mWellTyped(uhe))

test("uhe", mCopyOnWrite(uhe), SAMPLE)

test("uhe", mFromPlain(uhe))

test("uhe", mSample(uhe), SAMPLE)
