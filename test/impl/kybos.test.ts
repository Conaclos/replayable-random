
import test from "ava"
import { kybos } from "../../src/"
import * as SAMPLE from "../_data/kybos-sample.json"
import { mCopyOnWrite, mFromPlain, mSample, mWellTyped, mWellTypedStream } from "./test-macro"

test("kybos", mWellTypedStream(kybos))

test("kybos", mWellTyped(kybos))

test("kybos", mCopyOnWrite(kybos), SAMPLE)

test("kybos", mFromPlain(kybos))

test("kybos", mSample(kybos), SAMPLE)
