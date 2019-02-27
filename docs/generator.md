# Pseudo-Random Number Generators (PRNGs)

**Replayable Random** provides the following PRNGs:

| Name    | Entropy   | Period   | Author |
| ------- | --------- | -------- | ------ |
| `alea`  | 96 bits   | ~ 2^116  | Baagøe |
| `kybos` | 256 bits  | ?        | Baagøe |
| `uhe`   | 1536 bits | ~ 2^1556 | Gibson |

The implemented _pseudo-random number generators_ (PRNGs) are not
[cryptographically secure][crypto-random].

All PRNGs provides factories to derive a first geneartor state.
A geneartor state is either immutable or mutable.
Factories that returns mutable states are prefixed by `mut`.

## Alea

Alea was especially designed for JavaScript by Johannes Baagøe.
It is really lightweight and its imperative version has similar or better performance than `Math.random`.

-   [API reference](api/generator/alea.md)
-   [<> source code](../src/generator/alea.ts)

Alea is based on the robust [Multiply-With-Carry (MWC) PRNG][mwc-prng] invented by George Marsaglia. See the [author's website][alea] for more details.

## Kybos

Common PRNGs have well-defined mathematical properties.
We could consider their elegant properties to be a lack of randomness.
Kybos pass very stringent tests without satisfying the usual theoretical properties.
For instance, its period is not predictable.

-   [API reference](api/generator/kybos.md)
-   [<> source code](../src/generator/kybos.ts)

Kybos combines a given PRNG (by default Alea) with a variant of the Bays-Durham shuffle.
See the [author's website][kybos] for more details.

## UHE

Ultra-High-Entropy (UHE) was designed by Gibson Research Corporation. It is lightweight and it has large entropy. UHE is based on Alea.

-   [API reference](api/generator/uhe.md)
-   [<> source code](../src/generator/uhe.ts)

[crypto-random]: https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator
[mwc-prng]: https://en.wikipedia.org/wiki/Multiply-with-carry_pseudorandom_number_generator
[alea]: https://web.archive.org/web/20120619002808/http://baagoe.org/en/wiki/Better_random_numbers_for_javascript#Alea
[kybos]: https://web.archive.org/web/20120619002808/http://baagoe.org/en/wiki/Better_random_numbers_for_javascript#Kybos
