import test from "ava"
import { alea } from "../../src/"
import * as sample from "../_data/alea-sample.json"
import { mCopyOnWrite, mSample, mMutFromPlain, mFail } from "./generator-macro"

const PRNG_NAME = "alea"
const prng = alea

test(`${PRNG_NAME}_fail`, mFail, prng.mutFrom, sample)

test(`${PRNG_NAME}_sample`, mSample, prng.mutFrom, sample)

test(`${PRNG_NAME}_copy-on-write`, mCopyOnWrite, prng.from)

test(`${PRNG_NAME}_from-plain`, mMutFromPlain, prng.mutFrom, prng.mutFromPlain)
