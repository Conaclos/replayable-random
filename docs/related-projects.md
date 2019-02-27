# Related projects

Work In Progress...

All following projects enable to generate reproducible pseudo-random numbers.

[prando][prando] provides a mutable Object Oriented API that uses a *xorshift PRNG* based on the triplet combination invented by George Marsaglia.

[pure-rand][prand] provides a pure functional API and two PRNGs: *Mersenne Twister*, *Linear Congruential*.

[random-js][rand-js] provides an impure functional API and implements one PRNG: *Mersenne Twister*. It provides a large set of primites and proposes non-uniform distribution of random generations.

[random-seed][rand-seed] implements Gibson's *Ultra-High-Entropy* (UHE) PRNG. It uses an impure functional API.

[seedrandom][seedrand] provides an impure functional API and seven PRNGs: *alea* (Baagøe), *xor128* (Marsaglia), *tychei* (Neves / Araujo), *xorwow* (Marsaglia), *xor4096* (Brent), *xorshift7* (Panneton / L'ecuyer), *quick* (Bau)

Is your project missing in the list? Please, post an issue or a pull-request.

| Project                  | Functional API | Object Oriented API |
|--------------------------|----------------|---------------------|
| [replayable-random](#)   | Pure or Impue  |                     |
| [prando][prando]         |                | Mutable             |
| [pure-rand][prand]       | Pure           |                     |
| [random-js][rand-js]     | Impure         |                     |
| [random-seed][rand-seed] | Impure         |                     |
| [seedrandom][seedrand]   | Impure         |                     |

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
