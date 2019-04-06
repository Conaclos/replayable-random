// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { mutU32Between } from "./uniform-u32"
import { mutFill, pureFrom, pipe } from "../helper"
import { U8Array } from "../util/typed-array"
import { u32 } from "../util/number"
import { Distrib, MutDistrib } from "../core/distrib"

const mutU6 = mutU32Between(0)(64) // 64 excluded

/**
 * @param n number of 6bits items to generate
 * @return an imperative distribution that geenrates `n`
 *  random items of 6bits (base64).
 */
export const mutBase64Bytes: (n: u32) => MutDistrib<U8Array> = mutFill(mutU6)<
    U8Array
>(U8Array)

/**
 * @param n number of 6bits items to generate
 * @return a pure distribution that geenrates `n`
 *  random items of 6bits (base64).
 */
export const base64Bytes: (n: u32) => Distrib<U8Array> = pipe(mutBase64Bytes)(
    pureFrom
)
