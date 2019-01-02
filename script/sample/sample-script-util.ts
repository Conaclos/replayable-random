import { Random } from "../../src/core/random"

const SAMPLE_SIZE = 500
const SAMPLE_SEED = "seed"
const INDENTATION_SPACE_COUNT = 2

/**
 *
 * @param rng
 * @param count
 * @return Javascript module that exports an array of random
 *  u32 generated from seed {@code SAMPLE_SEED} using PRNG {@code rng}.
 */
export function sampleFrom<T>(rng: Random<T>): string {
    const stream = rng.streamFrom(SAMPLE_SEED)
    const values = Array.from(stream.nextU32Array(SAMPLE_SIZE))
    const sample = { seed: SAMPLE_SEED, values }
    return JSON.stringify(sample, undefined, INDENTATION_SPACE_COUNT)
}
