import { Macro } from "ava"
import { distrib, MutRandFrom, RandFrom, MutRand } from "../../src"
import { u32 as u32t } from "../../src/util/number"
import { FromPlain } from "../../src/util/data-validation"

// Every macro should start with the letter 'm'

const SEED = "replayable-random-seed" // used for deterministic tests
const REPETITION_NUMBER = 500

export interface Sample {
    seed: string
    values: u32t[]
}

export const mSample: Macro<[MutRandFrom<string>, Sample]> = (
    t,
    mutFrom,
    s
): void => {
    const g = mutFrom(s.seed)
    for (const expected of s.values) {
        t.is(distrib.mutU32(g), expected)
    }
}

export const mCopyOnWrite: Macro<[RandFrom<string>]> = (t, from): void => {
    let g = from(SEED)
    for (let i = 0; i < REPETITION_NUMBER; i++) {
        const plainCopy = JSON.parse(JSON.stringify(g))
        const res = distrib.u32(g)
        const plain = JSON.parse(JSON.stringify(g))
        t.deepEqual(plain, plainCopy)
        g = res[1]
    }
}

export const mMutFromPlain: Macro<[MutRandFrom<string>, FromPlain<MutRand>]> = (
    t,
    mutFfom,
    mutFromPlain
) => {
    t.is(mutFromPlain(undefined), undefined)
    t.is(mutFromPlain(null), undefined)
    t.is(mutFromPlain({}), undefined)

    const mutG = mutFfom(SEED)
    for (let i = 0; i < REPETITION_NUMBER; i++) {
        mutG.random() // mutate
        const mutGPlain = JSON.parse(JSON.stringify(mutG))
        t.not(mutFromPlain(mutGPlain), undefined)
    }
}
