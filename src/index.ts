// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

// core
export { Distrib, MutDistrib } from "./core/distrib"
export { ForkableMutRand, MutRand, Rand } from "./core/rand"
export { ForkableMutRandFrom, RandFrom, MutRandFrom } from "./core/rand-from"

// generators
import * as alea from "./generator/alea"
import * as kybos from "./generator/kybos"
import * as uhe from "./generator/uhe"
export { alea, kybos, uhe }

// distributions
import * as distrib from "./distrib"
export { distrib }

// helpers
import * as helper from "./helper"
export { helper }
