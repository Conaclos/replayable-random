# UHE

All factories to derive a first state are available under the namespace `uhe`.

```js
import { uhe } from "replayable-random"
```

Derive a first state from a [printable ASCII][printable-ascii] seed:

```js
// Pure functional API
const g = uhe.from("printable-ascii-seed")

// Imperative API
const mutG = uhe.mutFrom("printable-ascii-seed")
```

or from a (typed) array of bytes:

```js
const seed = (Uint8Array || Array).of(0x10, 0xff)

// Pure functional API
const g = uhe.fromBytes(seed)

// Imperative API
const mutG = uhe.mutFromBytes(seed)
```

The seed can be a [randomly generated](../../best-practices.md#seed-generation).

Serialise a generator state and recover it later:

```js
const plainG = JSON.parse(JSON.stringify(g))

// Pure functional API
const recoveredG = uhe.fromPlain(plainG)
if (recoveredG !== undefined) {
    // ...
}

// Imperative API
const mutRecoveredG = uhe.mutFromPlain(plainG)
if (mutRecoveredG !== undefined) {
    // ...
}
```

[printable-ascii]: https://en.wikipedia.org/wiki/ASCII#Printable_characters
