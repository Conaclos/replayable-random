import test from "ava"
import { kybos } from "../../src/"
import * as sample from "../_data/kybos-sample.json"
import { mSample, mCopyOnWrite, mMutFromPlain } from "./generator-macro"

const PRNG_NAME = "kybos"
const prng = kybos

test(`${PRNG_NAME}_sample`, mSample, prng.mutFrom, sample)

test(`${PRNG_NAME}_copy-on-write`, mCopyOnWrite, prng.from)

test(`${PRNG_NAME}_from-plain`, mMutFromPlain, prng.mutFrom, prng.mutFromPlain)
