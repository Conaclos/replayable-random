# Replayable Random

[![travis][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

**Replayable Random** enables to generate reproducible sequences of pseudo-random numbers.
The librray provides several seeded generators and multiple distributions.

## Highlights

### Choose an API

Replayable Random provides both a pure functional API and an imperative API.
The pure functional API is well-suited for projects that embrace immutability and purity.
It uses a [copy-on-write][cow] startegy to achieve better performances.

### Pay only for what you use

Replayable Random is designed to take advantage of modern dead code elimination techniques, especially [tree shaking][tree-shaking].
Using bundlers such as [rollup][rollup], your bundles can contain only the functions which are actually used.
Future versions of Replayable Random can integrate new functions without affecting the size of your bundles.

### Easily extensible

Replayable Random have well-defined interfaces and provides hightly composable helpers and distributions.

## Getting started

Install [replayable-random](#) as a dependency:

```sh
npm install replayable-random
```

### Choose a random generator

Import a genrator using its name, e.g. `alea`:

```js
import { alea } from "replayable-random"
```

Derive the first state from a string (printable ASCII) seed:

```js
// Pure functional API
const g = alea.from("printable-ascii-seed")

// Imperative API
const mutG = alea.mutFrom("printable-ascii-seed")
```

### Choose a distribution

Import `distrib`:

```js
import { alea, distrib } from "replayable-random"
```

Choose a distribution and generate your first random numbers.
e.g. to generate two integers between -4 (inclusive) and 5 (excluded):

```js
// Pure functional API
const [n1, g1] = distrib.i32Between(-4)(5)(g)
const [n2, g2] = distrib.i32Between(-4)(5)(g1)

// Imperative API
let n
n = distrib.mutI32Between(-4)(5)(mutG)
n = distrib.mutI32Between(-4)(5)(mutG)

// Math.random compatibility
n = distrib.mutI32Between(-4)(5)(Math)
n = distrib.mutI32Between(-4)(5)(Math)
```

## Documentation

-   [Available PRNGs](docs/generator.md)
-   [Available distributions](docs/distrib.md)
-   [Best practices](docs/best-practices.md)
-   Write your own PRNG (coming soon)
-   Write your own distribution (coming soon)

[travis-image]: https://img.shields.io/travis/Conaclos/replayable-random/master.svg
[travis-url]: https://travis-ci.org/Conaclos/replayable-random
[npm-image]: https://img.shields.io/npm/v/replayable-random.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/replayable-random
[cow]: https://en.wikipedia.org/wiki/Copy-on-write
[rollup]: https://github.com/rollup/rollup
[tree-shaking]: https://en.wikipedia.org/wiki/Tree_shaking
