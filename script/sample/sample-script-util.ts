// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutRandFrom } from "../../src/core/rand-from"
import { mutFill } from "../../src/helper/array-helper"
import { distrib } from "../../src/"

const SAMPLE_SIZE = 500
const SAMPLE_SEED = "replayable-random-seed"
const INDENTATION_SPACE_COUNT = 2

const mutU32Array = mutFill(distrib.mutU32)(Array)

/**
 *
 * @param rng
 * @param count
 * @return Javascript module that exports an array of random
 *  u32 generated from seed {@code SAMPLE_SEED} using PRNG {@code rng}.
 */
export function sampleFrom<T>(mutFrom: MutRandFrom<string>): string {
    const g = mutFrom(SAMPLE_SEED)
    const values = mutU32Array(SAMPLE_SIZE)(g)
    const sample = { seed: SAMPLE_SEED, values }
    return JSON.stringify(sample, undefined, INDENTATION_SPACE_COUNT)
}
