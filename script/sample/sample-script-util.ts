
import { Random } from "../../src/core/random"
import { u32 } from "../../src/util/number"

export const SAMPLE_SIZE = 500
export const SAMPLE_SEED = "seed"

/**
 *
 * @param prng
 * @param count
 * @return Javascript module that exports an array of random
 *  u32 generated from seed {@code SAMPLE_SEED} using PRNG {@code prng}.
 */
export function sampleFrom <T> (prng: Random<T>): string {
    const stream = prng.streamFrom(SAMPLE_SEED)

    let result = "export const sample = [\n"
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        result = `${result}${stream.nextU32()},\n`
    }
    return `${result}]`
}
