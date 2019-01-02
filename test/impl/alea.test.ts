
import test from "ava"
import { alea } from "../../src/"
import * as SAMPLE from "../_data/alea-sample.json"
import { mCopyOnWrite, mFromPlain, mSample, mWellTyped, mWellTypedStream } from "./test-macro"

test("alea", mWellTypedStream(alea))

test("alea", mWellTyped(alea))

test("alea", mCopyOnWrite(alea), SAMPLE)

test("alea", mFromPlain(alea))

test("alea", mSample(alea), SAMPLE)
