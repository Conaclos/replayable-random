In a uniform distribution, two distinct elements have the same probability to be randomly chosen.

**Replayable- Random** provides several uniform distributions:

-   [fract32](#uniform-fract32)
-   [fract53](#uniform-fract53)
-   [i32](#uniform-i32)
-   [u32](#uniform-u32)
-   [i54](#uniform-i54)
-   [base64](#uniform-base64)

## Uniform fract32

A `fract32` is a non-negative 64 bits float number between `0` (included) and `1` (excluded).
The genearted float uses 32 significant bits.
It is [precise][dyadic].

Generate a fract32:

```js
// Pure API
const [n1, g1] = distrib.fract32(g)

// Imperative API
const n = distrib.mutFract32(mutG)
```

Generate `n` fract32:

```ts
// Pure API
const [xs, g1] = distrib.fract32Fill<number[]>(Array)(n)(g)
// or
const [xs, g1] = distrib.fract32Fill(Float64Array)(n)(g)
```

## Uniform fract53

A `fract52` is a non-negative 64 bits float number between `0` (included) and `1` (excluded).
The genearted float uses 53 significant bits.
It is [precise][dyadic].

Generate a fract53:

```js
// Pure API
const [n1, g1] = distrib.fract53(g)

// Imperative API
const n = distrib.mutFract53(mutG)
```

Generate `n` fract53:

```ts
// Pure API
const [xs, g1] = distrib.fract53Fill<number[]>(Array)(n)(g)
// or
const [xs, g1] = distrib.fract53Fill(Float64Array)(n)(g)
```

## Uniform i32

A `i32` is an integer encoded on 32 bits.
It can encode integers from `-0x8000_0000` to `0x7fff_ffff`.

Generate a i32:

```js
// Pure API
const [n1, g1] = distrib.i32(g)

// Imperative API
const n = distrib.mutU32(mutG)
```

Gnerate a i32 between `l` and `u` (excluded)

```js
// Pure API
const [n1, g1] = distrib.i32Between(l)(u)(g)

// Imperative API
const n = distrib.mutU32Between(l)(u)(g)
```

Generate `n` i32:

```ts
// Pure API
const [xs, g1] = distrib.i32Fill<number[]>(Array)(n)(g)
// or
const [xs, g1] = distrib.i32Fill(Int32Array)(n)(g)
```

## Uniform u32

A `u32` is an unsigned integer encoded on 32 bits.
It can encode natural numbers from `0` to `0xffff_ffff`.

Generate a u32:

```js
// Pure API
const [n1, g1] = distrib.u32(g) // Generate a u32

// Imperative API
const n = distrib.mutU32(mutG) // Generate a u32
```

Gnerate a u32 between `l` and `u` (excluded)

```js
// Pure API
const [n1, g1] = distrib.u32Between(l)(u)(g)

// Imperative API
const n = distrib.mutU32Between(l)(u)(g)
```

Generate `n` u32:

```ts
// Pure API
const [xs, g1] = distrib.u32Fill<number[]>(Array)(n)(g)
// or
const [xs, g1] = distrib.u32Fill(Uint32Array)(n)(g)
```

## Uniform i54

A `i54` is a [safe integer][safe-integer].

Generate a i54:

```js
// Pure API
const [n1, g1] = distrib.i54(g) // Generate a u32

// Imperative API
const n = distrib.mutI54(mutG) // Generate a u32
```

Gnerate a i54 between `l` and `u` (excluded)

```js
// Pure API
const [n1, g1] = distrib.i54Between(l)(u)(g)

// Imperative API
const n = distrib.mutI54Between(l)(u)(g)
```

Generate `n` i54:

```ts
// Pure API
const [xs, g1] = distrib.i54Fill<number[]>(Array)(n)(g)
// or
const [xs, g1] = distrib.i54Fill(Uint32Array)(n)(g)
```

## Uniform base64

A [base64][base64] element can be encoded on 6 bits and represented by a subset of printable ASCII.
This makes base64 strings suitable for data exchange between humans and computers.

Generate an array of `n` bytes that includes 6 bits elements:

```js
// Pure API
const [xs1, g1] = distrib.base64Bytes(n)(g)

// Imperative API
const xs = distrib.mutBase64Bytes(n)(mutG)
```

[base64]: https://en.wikipedia.org/wiki/Base64
[dyadic]: https://en.wikipedia.org/wiki/Dyadic_rational
[safe-integer]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger
