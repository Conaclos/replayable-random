
import { Suite, Event } from "benchmark"

import { uhe } from "../../src/impl/uhe"

const suite = new Suite()
const async = true
const config = { async }

const stream = uhe.streamFrom("seed")
const state = uhe.from("seed")

// Tests
suite.add("Math.random", (): void => {
    Math.random()
})
.add("uhe#nextFract32", (): void => {
    stream.nextFract32()
})
.add("uhe#fract32", (): void => {
    uhe.fract32(state)
})
// Listeners
.on("cycle", (event: Event): void => {
  console.info(String(event.target))
})
.run(config)
