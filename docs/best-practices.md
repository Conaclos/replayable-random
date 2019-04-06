# Best practices

## Memorize function applications

**replayable-random** heavily rely on [curried][currying] function, i.e. functions that have a single parameter and returns a new function.

We can take advantage of it to avoid unecessary computations and input validations. Indeed, we can memorize intermediate results.

For example we can turn the following code:

```js
for (let i = 0; i < 1000; i++) {
    const n = distrib.mutU32Between(0)(5)(mutG)
    console.log(n)
}
```

into:

```js
const f = distrib.mutU32Between(0)(5)
for (let i = 0; i < 1000; i++) {
    const n = f(mutG)
    console.log(n)
}
```

The inputs `0` and `5` are valided only once.

## Seed generation

Some applications need to generate a seed for every new user.
The seed should be human and computer friendely for easy exchange and storage.

To this end, **Replayable- Random** provides a distribution to generate array of [base64][base64] elements.

Generate a seed of 120 bits (6 bits \* 20) using Math generator:

```js
const seed = distrib.mutBase64Bytes(20)(Math)
```

Derive a first state from alea geneartor using this seed:

```js
// Pure API
const g = alea.fromBytes(seed)

// Imperative API
const mutG = alea.mutFromBytes(seed)
```

## Batch random generations

Coming soon...

[base64]: https://en.wikipedia.org/wiki/Base64
[currying]: https://en.wikipedia.org/wiki/Currying
