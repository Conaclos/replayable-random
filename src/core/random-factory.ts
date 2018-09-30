// Copyright (c) 2018 Victorien Elvinger
//
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { stringAsUint8Array } from "../util/string-encoding"

/**
 * Immutable common factory interface for seeded random generators.
 * The generic type corresponds to the generator state's type.
 */
export interface RandomFactory <S> {
    /**
     * @param seed
     * @return generator state using seed to produce deterministic generations
     */
    readonly from: (this: void, seed: string) => Readonly<S>

    /**
     * @param seed
     * @return generator state using seed to produce deterministic generations
     */
    readonly fromUint8Array: (this: void, seed: Uint8Array) => Readonly<S>
}

export const randomFactoryFrom =
    <S> ({ fromUint8Array }: Pick<RandomFactory<S>, "fromUint8Array">): RandomFactory<S> => ({
        fromUint8Array,

        from: (seed: string) => fromUint8Array(stringAsUint8Array(seed)),
    })
