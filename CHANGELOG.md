# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.4.1"></a>
## [0.4.1](https://github.com/Conaclos/replayable-random/compare/v0.4.0...v0.4.1) (2019-06-09)


### Bug Fixes

* handlebars vulnerability ([d037b78](https://github.com/Conaclos/replayable-random/commit/d037b78))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/Conaclos/replayable-random/compare/v0.3.0...v0.4.0) (2019-04-06)


### Features

* **distrib:** add base64 distrib ([6947b46](https://github.com/Conaclos/replayable-random/commit/6947b46))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/Conaclos/replayable-random/compare/v0.2.0...v0.3.0) (2019-03-02)


### Code Refactoring

* make tree-shaking friendly the library ([14b34fe](https://github.com/Conaclos/replayable-random/commit/14b34fe))


### Features

* check arguments for robustness ([6ed5ede](https://github.com/Conaclos/replayable-random/commit/6ed5ede))


### BREAKING CHANGES

* All distributions are now standalone curried functions that
take a generator state as last input.
Every geneartor state provides methods to mutate or to generate a
generator state.
Distributions use dynamic dispatch on the genartor state in order
to be generic.



<a name="0.2.0"></a>
# [0.2.0](https://github.com/Conaclos/replayable-random/compare/v0.1.0...v0.2.0) (2019-01-07)


### Code Refactoring

* turn RandomSTream into an interface ([180b4cf](https://github.com/Conaclos/replayable-random/commit/180b4cf))


### Features

* add generation of random array ([56fd677](https://github.com/Conaclos/replayable-random/commit/56fd677))
* add kybos prng ([644a7ed](https://github.com/Conaclos/replayable-random/commit/644a7ed))
* **uhe:** improve efficiency for the pure version of uhe. ([352311e](https://github.com/Conaclos/replayable-random/commit/352311e))
* introduce smart copy-on-write ([d511a8a](https://github.com/Conaclos/replayable-random/commit/d511a8a))


### BREAKING CHANGES

- remove streamFromUint8Array from Random inetrafce
- remove stateSnapshot from RandomStream



<a name="0.1.0"></a>
# 0.1.0 (2018-09-30)


### Features

* initial commit ([cbc67b3](https://github.com/Conaclos/replayable-random/commit/cbc67b3))
