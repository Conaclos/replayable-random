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

[currying]: https://en.wikipedia.org/wiki/Currying
