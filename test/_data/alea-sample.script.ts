
import { alea } from "../../src/impl/alea"

const SAMPLE_SIZE = 500

const stream = alea.streamFrom("seed")

let result = "export const sample = [\n"
for (let i = 0; i < SAMPLE_SIZE; i++) {
    result = `${result}${stream.nextU32()},\n`
}
result = `${result}]`

console.info(result)
