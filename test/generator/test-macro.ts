import { Macro, ExecutionContext } from "ava"
import { u32 as u32t } from "../../src/util/number"
import { RandFrom, MutRandFrom } from "../../src/core/rand-from"
import { MutDistrib } from "../../src/core/distrib"
import { mutU32, u32 } from "../../src/distrib/uniform-u32"

// Every macro should start with the letter 'm'

const REPETITION_NUMBER = 300

export function mMutFract32<T>(
    t: ExecutionContext,
    mutFrom: MutRandFrom<string>,
    distrib: MutDistrib<T>,
    pred: (x: T) => boolean
): void {
    const g = mutFrom("seed")
    for (let i = 0; i < REPETITION_NUMBER; i++) {
        t.true(pred(distrib(g)))
    }
}

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
        t.is(mutU32(g), expected)
    }
}

export const mCopyOnWrite: Macro<[RandFrom<string>]> = (t, from): void => {
    let g = from("seed")
    for (let i = 0; i < REPETITION_NUMBER; i++) {
        const plainCopy = JSON.parse(JSON.stringify(g))
        const res = u32(g)
        const plain = JSON.parse(JSON.stringify(g))
        t.deepEqual(plain, plainCopy)
        g = res[1]
    }
}
