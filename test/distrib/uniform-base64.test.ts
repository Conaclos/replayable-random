import { alea, distrib } from "../../src"
import test from "ava"
import { isU6 } from "../testutils"

const SEED = "replayable-random-seed" // used for deterministic tests
const REPETITION_COUNT = 500

test("mut-base64-bytes", (t) => {
    const mutG = alea.mutFrom(SEED)
    const arr = distrib.mutBase64Bytes(REPETITION_COUNT)(mutG)
    t.true(arr.every(isU6))
})

test("base64-bytes", (t) => {
    const g = alea.from(SEED)
    const [arr] = distrib.base64Bytes(REPETITION_COUNT)(g)
    t.true(arr.every(isU6))
})
