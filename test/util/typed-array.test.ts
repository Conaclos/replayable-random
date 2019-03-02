import test from "ava"
import { U8Array, arrayFromFallback } from "../../src/util/typed-array"

test("array-from-fallback", (t) => {
    const arr = [1, 2]
    const typedArr = new U8Array(2)
    typedArr[0] = arr[0]
    typedArr[1] = arr[1]
    t.deepEqual(arrayFromFallback(arr), arr)
    t.deepEqual(arrayFromFallback(typedArr), arr)
})
