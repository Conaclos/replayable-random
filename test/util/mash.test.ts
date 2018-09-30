
import test from "ava"

import { mash, mashes, DEFAULT_MASH_INPUT, DEFAULT_MASH_N } from "../../src/util/mash"
import { isU32 } from "../testutils"

test("mash", (t) => {
    const input1 = Uint8Array.of(50, 80, 0)
    const input2 = Uint8Array.of(1, 200, 102)
    const input3 = Uint8Array.of(1, 1, 1, 1)
    const input4 = Uint8Array.of(0, 0, 0, 0)

    let m = mash(DEFAULT_MASH_N, DEFAULT_MASH_INPUT)
    for (const input of [input1, input2, input3, input4]) {
        m = mash(m, input)
        t.true(isU32(m), "mash seed are u32")
    }
})

test("mashes", (t) => {
    const input = Uint8Array.of(50, 80, 0)
    const hashes = mashes(input, 10)

    const m = mash(DEFAULT_MASH_N, DEFAULT_MASH_INPUT)
    for (const h of hashes) {
        t.true(isU32(h), "mash seed are u32")
    }
})
