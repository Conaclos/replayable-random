import test from "ava"
import { uhe } from "../../src/"
import * as sample from "../_data/uhe-sample.json"
import { mSample, mCopyOnWrite, mMutFromPlain, mFail } from "./generator-macro"

const PRNG_NAME = "uhe"
const prng = uhe

test(`${PRNG_NAME}_fail`, mFail, prng.mutFrom, sample)

test(`${PRNG_NAME}_sample`, mSample, prng.mutFrom, sample)

test(`${PRNG_NAME}_copy-on-write`, mCopyOnWrite, prng.from)

test(`${PRNG_NAME}_from-plain`, mMutFromPlain, prng.mutFrom, prng.mutFromPlain)
