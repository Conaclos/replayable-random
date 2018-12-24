
# Replayable Random

[![travis][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

**Replayable Random** provides both a pure functional API and a mutable Object Oriented API to generate reproducible sequences of pseudo-random numbers.

Note that the implemented *pseudo-random number generators* (PRNG) are not [cryptographically secure][crypto-random].


## Contents

- [Aims](#aims)
- [Setup](#setup)
- [Common usages](#common-usages)
- [Advanced usages](#advanced-usages)
- [Available PRNGs](#available-prngs)
- [Related projects](#related-projects)


## Aims

- Replayable sequences of pseudo-random numbers regardless the platform
- Well-typed primitives
- Pure functional API and mutable Object Oriented API
- Multiple PRNGs
- Reasonable performances, and potentially better than `Math.random` *

\* A copy-on-write strategy is used for the pure functional API.

## Setup

Install `replayable-random` as a dependency using npm:

```sh
npm install replayable-random
```

or using yarn:

```sh
yarn add replayable-random
```


## Common usages

Import a random generator. e.g. `alea`:

```ts
import { alea } from "replayable-random"
```

In the following sub-sections, we assume that this generator is imported.
 We first present the pure functional API, then we present the mutable Object Oriented API.

Every generator conforms to the same interfaces.

### Pure functional API

Every time that a random number is generated, a new state is returned.

Derive your first generator's state from a seed:

```ts
// using a string seed
const s1 = alea.from("seed")
```

See [`Random`](src/core/random.ts) for all available state derivators.

Generate your first random numbers:

```ts
// unsigned int 32bits
const [n, s2] = alea.u32(s1)

// safe integer
const [i, s3] = alea.i54(s2)

// unsigned int between 1 (inclusive) and 5 (exclusive)
const [n2, s4] = alea.u32Between(1, 5)(s3)

// signed int between -4 (inclusive) and 5 (exclusive)
const [i2, s5] = alea.i32Between(-4, 5)(s4)

// float with 32 significant bits between 0 (inclusive) and 1 (exclusive)
const [f, s6] = alea.fract32(s5)
```

See [`Random`](src/core/random.ts) for all available functions.

### Object Oriented Stream API

The state is mutable and changes every time that a random number is generated.

Instanciate your generator:

```ts
// using a string seed
const gen = alea.streamFrom("seed")
```

See [`Random`](src/core/random-stream-factory.ts) for all available stream factories.

Generate your first random numbers:

```ts
// unsigned int 32bits
const n = gen.nextU32()

// safe integer
const i = gen.nextI54()

// unsigned int between 1 (inclusive) and 5 (exclusive)
const n2 = gen.nextU32Between(1, 5)

// signed int between -4 (inclusive) and 5 (exclusive)
const i2 = gen.nextI32Between(-4, 5)

// float with 32 significant bits between 0 (inclusive) and 1 (exclusive)
const f = gen.nextFract32()
```

Note that you can backup the generator's state and start where you stopped
 the last time:

```ts
// get a snapshot of the generator's state
const snapshot = JSON.parse(JSON.stringify(gen))

// start from a given snapshot
const stream = alea.streamFromPlain(snapshot)
if (stream !== undefined) {
    // useable stream
}
```

See [`RandomStream`](src/core/random-stream.ts) for all available methods.


# Advanced usages

Coming soon...


# Available PRNGs

| Name    | Entropy    | Period    | Author  |
|---------|------------|-----------|---------|
| `alea`  | 96 bits    | ~ 2^116   | Baagøe  |
| `kybos` | 256 bits   | ?         | Baagøe  |
| `uhe`   | 1536 bits  | ~ 2^1556  | Gibson  |


# Related projects

Work In Progress...

All following projects enable to generate reproducible pseudo-random numbers.

[prando][prando] provides a mutable Object Oriented API that uses a *xorshift PRNG* based on the triplet combination invented by George Marsaglia.

[pure-rand][pure-rand] provides an immutable Object Oriented API and two PRNGs: *Mersenne Twister*, *Linear Congruential*.

[random-js][rand-js] provides an impure functional API and implements one PRNG: *Mersenne Twister*. It provides a large set of primites and proposes non-uniform distribution of random generations.

[random-seed][rand-seed] implements Gibson's *Ultra-High-Entropy* (UHE) PRNG. It uses an impure functional API.

[seedrandom][seedrand] provides an impure functional API and seven PRNGs: *alea* (Baagøe), *xor128* (Marsaglia), *tychei* (Neves / Araujo), *xorwow* (Marsaglia), *xor4096* (Brent), *xorshift7* (Panneton / L'ecuyer), *quick* (Bau)

Is your project missing in the list? Please, post an issue or a pull-request.

| Project                  | Functional API | Object Oriented API |
|--------------------------|----------------|---------------------|
| [replayable-random](#)   | Pure           | Mutable             |
| [prando][prando]         |                | Mutable             |
| [pure-rand][prand]       |                | Immutable           |
| [random-js][rand-js]     | Impure         |                     |
| [random-seed][rand-seed] | Impure         |                     |
| [seedrandom][seedrand]   | Impure         |                     |


[travis-image]:
https://img.shields.io/travis/Conaclos/replayable-random/master.svg
[travis-url]: https://travis-ci.org/Conaclos/replayable-random
[npm-image]:
https://img.shields.io/npm/v/replayable-random.svg?style=flat-square
[npm-url]:
https://www.npmjs.com/package/replayable-random
[crypto-random]:
https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator

[prand]:
https://github.com/dubzzz/pure-rand
[prando]:
https://github.com/zeh/prando
[rand-js]:
https://github.com/ckknight/random-js
[rand-seed]:
https://github.com/skratchdot/random-seed
[seedrand]:
https://github.com/davidbau/seedrandom