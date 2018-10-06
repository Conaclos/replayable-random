// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { U32_TOP } from "../util/number"
import { MutRandom } from "./mut-random"
import { RandomFactory } from "./random-factory"
import { RandomStream } from "./random-stream"

/**
 * Common factory interface for stateful seeded random generators.
 * The generic type corresponds to the generator state's type.
 */
export interface RandomStreamFactory<S> {
    /**
     * @param seed
     * @return Random generator using seed to produce deterministic randoms
     */
    readonly streamFrom: (this: void, seed: string) => RandomStream<S>

    /**
     * @param state generator state
     * @return Random generator using an existing generator's state
     */
    readonly streamFromState: (this: void, state: Readonly<S>) => RandomStream<S>

    /**
     * @param seed
     * @return Random generator using seed to produce deterministic randoms
     */
    readonly streamFromUint8Array: (this: void, seed: Uint8Array) => RandomStream<S>
}

export const srandomStreamFactoryFrom =
    <S> (rand: MutRandom<S>, randFactory: RandomFactory<S>): RandomStreamFactory<S> => ({
        streamFrom: (seed) =>
            new RandomStream(randFactory.from(seed), rand),

        streamFromState: (state) => // deeply opy state to protect internal state
            new RandomStream(rand.smartCopy(state, U32_TOP), rand),

        streamFromUint8Array: (seed) =>
            new RandomStream(randFactory.fromUint8Array(seed), rand),
    })
