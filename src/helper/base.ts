// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

import { MutDistrib, Distrib } from "../core/distrib"

/**
 * Derive a pure distrition from its imperative version.
 *
 * @param d used imperative distribution
 * @return a function that accepts a random generator, and returns
 *  a random element of type T and next generator state
 */
export const pureFrom = <T>(d: MutDistrib<T>): Distrib<T> => (g) => g.derive(d)

/**
 * Left-to-right function composition.
 * g | f = pipe(g)(f) = compose(f)(g) = f . g
 *
 * @param g
 * @return a function that accepts a function f and returns the composition of
 *  f and g.
 */
export const pipe = <I, T>(g: (x: I) => T) => <O>(f: (y: T) => O) => (x: I) =>
    f(g(x))

/**
 * Right-to-left function composition.
 * f . g = compose(f)(g) = pipe(g)(f) = g | f
 *
 * @param f
 * @return a function that accepts a function g and returns the composition of
 *  f and g.
 */
export const compose = <O, T>(f: (y: T) => O) => <I>(g: (x: I) => T) =>
    pipe(g)(f)
