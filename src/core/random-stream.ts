// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { i32, u32, i54, fract32, fract53 } from "../util/number"
import { MutRandom } from "./mut-random"

/**
 * Stateful seeded random generator based on a stateless version of the genrator.
 * The generic type corresponds to the generator state's type.
 *
 * The state is mutated every time a new random is generated.
 */
export class RandomStream <S> {
// Implemtation
    /**
     * NOTE: Use a stream-random factory instead.
     *
     * @param state initial state (will be mutated)
     * @param generator stateless gnerator
     */
    constructor (state: S, generator: MutRandom<S>) {
        this.state = state
        this.generator = generator
    }

    /**
     * Internal mutated state.
     */
    private readonly state: S

    /**
     * Stateless generator.
     */
    private readonly generator: MutRandom<S>

// State
    /**
     * @return snapshot of the current generator's state
     */
    stateSnapshot (): Readonly<S> {
        return this.generator.deepCopy(this.state)
    }

// Generation
    /**
     * @return a random unsigned integer (32bits)
     */
    nextU32 (): u32 {
        return this.generator.mutU32(this.state)
    }

    /**
     * @return a random safe integer (54bits)
     */
    nextI54 (): i54 {
        return this.generator.mutI54(this.state)
    }

    /**
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @return a random unsigned integer (32bits) in interval [l, exclusiveU[
     */
    nextU32Between ( l: u32, exclusiveU: u32): u32 {
        return this.generator.mutU32Between(l, exclusiveU)(this.state)
    }

    /**
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @return a random integer (32bits) in interval [l, exclusiveU[
     */
    nextI32Between (l: i32, exclusiveU: i32): i32 {
        return this.generator.mutI32Between(l, exclusiveU)(this.state)
    }

    /**
     * @return a random float in interval [0, 1[ using 32 significant bits
     */
    nextFract32 (): fract32 {
        return this.generator.mutFract32(this.state)
    }

    /**
     * @return a random float in interval [0, 1[ using 53 significant bits
     */
    nextFract53 (): fract53 {
        return this.generator.mutFract53(this.state)
    }
}
