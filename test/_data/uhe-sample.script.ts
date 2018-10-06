
import { uhe } from "../../src/impl/uhe"

const SAMPLE_SIZE = 500

const stream = uhe.streamFrom("seed")

let result = "export const sample = [\n"
for(let i = 0; i < SAMPLE_SIZE; i++) {
    result = result + stream.nextU32() + ",\n"
}
result = result + "]"

console.info(result)
