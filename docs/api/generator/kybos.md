
# Kybos

All factories to derive a first state are available under the namespace `kybos`.

```js
import { kybos } from "replayable-random"
```

Kybos internally uses another random generator.
By default Alea us used.
You can [choose another random generator](#custom-prng).

## Default PRNG

You can derive a first state from a [printable ASCII][printable-ascii] seed:

```js
// Pure functional API
const g = kybos.from("printable-ascii-seed")

// Imperative API
const mutG = kybos.mutFrom("printable-ascii-seed")
```

or from a (typed) array of bytes:
```js
const seed = (Uint8Array || Array).of(0x10, 0xff)

// Pure functional API
const g = kybos.fromBytes(seed)

// Imperative API
const mutG = kybos.mutFromBytes(seed)
```

You can also serialise a generator state and recover it later:

```js
const plainG = JSON.parse(JSON.stringify(g))

// Pure functional API
const recoveredG = kybos.fromPlain(plainG)
if (recoveredG !== undefined) {
    // ...
}

// Imperative API
const mutRecoveredG = kybos.mutFromPlain(plainG)
if (mutRecoveredG !== undefined) {
    // ...
}
```

## Custom PRNG

We choose **UHE** as custom random generator.
You can use any random geneartor, even Kybos itself!

You can derive a first state from a [printable ASCII][printable-ascii] seed:

```js
// Pure functional API
const g = kybos.fromUsing(uhe.mutFromBytes)("printable-ascii-seed")

// Imperative API
const mutG = kybos.mutFromUsing(uhe.mutFromBytes)("printable-ascii-seed")
```

or from a (typed) array of bytes:
```js
const seed = (Uint8Array || Array).of(0x10, 0xff)

// Pure functional API
const g = kybos.fromBytesUsing(uhe.mutFromBytes)(seed)

// Imperative API
const mutG = kybos.mutFromBytesUsing(uhe.mutFromBytes)(seed)
```

You can also serialise a generator state and recover it later:

```js
const plainG = JSON.parse(JSON.stringify(g))

// Pure functional API
const recoveredG = kybos.fromPlainUsing(uhe.fromPlain)(plainG)
if (recoveredG !== undefined) {
    // ...
}

// Imperative API
const mutRecoveredG = kybos.mutFromPlainUsing(uhe.fromPlain)(plainG)
if (mutRecoveredG !== undefined) {
    // ...
}
```

[printable-ascii]: https://en.wikipedia.org/wiki/ASCII#Printable_characters
