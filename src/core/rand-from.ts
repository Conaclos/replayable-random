// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutRand, Rand, ForkableMutRand } from "./rand"

export interface MutRandFrom<T> {
    /**
     * @param seed
     * @return a mutable genartor state derived from `seed`
     */
    (seed: T): MutRand
}

export interface RandFrom<T> {
    /**
     * @param seed
     * @return an immutable generator state derived from `seed`
     */
    (seed: T): Rand
}

export interface ForkableMutRandFrom<T> {
    /**
     * @param seed
     * @return a forkable genartor state derived from `seed`
     */
    (seed: T): ForkableMutRand
}
