import { Macro } from "ava"
import { MutRandFrom, MutDistrib, Distrib, RandFrom } from "../../src"
import { ArrayDistrib } from "../../src/helper/array-helper"

// Every macro should start with the letter 'm'

const SEED = "replayable-random-seed" // used for deterministic tests
const REPETITION_COUNT = 500

export type MutDistribMacro = Macro<
    [MutRandFrom<string>, MutDistrib<number>, (x: number) => boolean]
>

export const mMutDistrib: MutDistribMacro = (t, mutFrom, mutDistrib, pred) => {
    const mutG = mutFrom(SEED)
    for (let i = 0; i < REPETITION_COUNT; i++) {
        const n = mutDistrib(mutG)
        t.true(pred(n))
    }
}

export type DistribMacro = Macro<
    [RandFrom<string>, Distrib<number>, (x: number) => boolean]
>

export const mDistrib: DistribMacro = (t, from, distrib, pred) => {
    let g = from(SEED)
    for (let i = 0, n; i < REPETITION_COUNT; i++) {
        ;[n, g] = distrib(g)
        t.true(pred(n))
    }
}

export type ArrayDistribMacro = Macro<
    [RandFrom<string>, ArrayDistrib<number>, (x: number[]) => boolean]
>

export const mArrayDistrib: ArrayDistribMacro = (t, from, distrib, pred) => {
    const g = from(SEED)
    const [arr] = distrib<number[]>(Array)(REPETITION_COUNT)(g)
    t.true(pred(arr))
}
