# Distributions

All distributions are available under the namespace `distrib`.

```js
import { distrib } from "replayable-random"
```

Distributions comes in two flavors:

-   Pure distributions takes an immutable generator state as last input and returns a pair that consists of a random element and the next immutable generator state.
-   Imperative distribution takes a mutable generator state as last input and returns a random element.

Most distributions are aivailable in the two flavors. Every imperative distribution is prefeixed by `mut`. The corresponding pure distribution has the same name but without this prefix.

```js
// Pure API
const [n2, g2] = distrib.u32Between(0)(5)(g1)

// Imperative API
const n = distrib.mutU32Between(0)(5)(g)
```

**Replayable Random** provides several types of distributions:

-   [Uniform distributions](api/distrib/uniform.md)
