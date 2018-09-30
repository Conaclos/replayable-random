
import test from "ava"

import { encodeString } from "../../src/util/string-encoding"

test("asUint8Array", (t) => {
     t.deepEqual(encodeString("test"), Uint8Array.of(116, 101, 115, 116))
})
