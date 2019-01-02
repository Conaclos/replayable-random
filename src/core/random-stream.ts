// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { fract32, fract53, i32, i54, u32 } from "../util/number"

/**
 * Stateful seeded random generator.
 * The state is mutated every time a new random is generated.
 */
export interface RandomStream {
    /**
     * @return a random unsigned integer (32bits)
     */
    readonly nextU32: () => u32

    /**
     * @return a random safe integer (54bits)
     */
    readonly nextI54: () => i54

    /**
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @return a random unsigned integer (32bits) in interval [l, exclusiveU[
     */
    readonly nextU32Between: (l: u32, exclusiveU: u32) => u32

    /**
     * @param l lower bound (inclusive)
     * @param exclusiveU upper bound (exclusive)
     * @return a random integer (32bits) in interval [l, exclusiveU[
     */
    readonly nextI32Between: (l: i32, exclusiveU: i32) => i32

    /**
     * @return a random float in interval [0, 1[ using 32 significant bits
     */
    readonly nextFract32: () => fract32

    /**
     * @return a random float in interval [0, 1[ using 53 significant bits
     */
    readonly nextFract53: () => fract53

    /**
     * @param n number of generated unsigned integer (8bits)
     * @return array that contains a number of n unsigned integer (8bits)
     */
    readonly nextU8Array: (n: u32) => Uint8Array

    /**
     * @param n number of generated unsigned integer (32bits)
     * @return array that contains a number of n unsigned integer (32bits)
     */
    readonly nextU32Array: (n: u32) => Uint32Array
}
