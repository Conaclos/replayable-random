import { Event, Suite } from "benchmark"
import { alea, distrib, Rand } from "../../src/"

const suite = new Suite()
const async = true
const config = { async }

const stream = alea.mutFrom("seed")
let state = alea.from("seed")
let r

// Tests
suite
    .add(
        "Math.random",
        (): void => {
            r = Math.random()
        }
    )
    .add(
        "alea#mutFract32",
        (): void => {
            r = distrib.mutFract32(stream)
        }
    )
    .add(
        "alea#fract32",
        (): void => {
            state = distrib.fract32(state)[1]
        }
    )
    // Listeners
    .on(
        "cycle",
        (event: Event): void => {
            console.info(String(event.target))
        }
    )
    .run(config)
