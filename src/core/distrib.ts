// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutRand, Rand } from "./rand"

/**
 * Imperative distribution
 */
export interface MutDistrib<T> {
    /**
     * @param mutG [mutated] generator state
     * @return a random element of type T
     */
    (mutG: MutRand): T
}

/**
 * Pure distribution
 */
export interface Distrib<T> {
    /**
     * @param g generator state
     * @return a random element of type T, and the next generator state
     */
    (g: Rand): [T, Rand]
}
