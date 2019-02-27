import { Event, Suite } from "benchmark"
import { uhe, distrib } from "../../src/"

const suite = new Suite()
const async = true
const config = { async }

const stream = uhe.mutFrom("seed")
let state = uhe.from("seed")

// Tests
suite
    .add(
        "Math.random",
        (): void => {
            Math.random()
        }
    )
    .add(
        "uhe#nextFract32",
        (): void => {
            stream.random()
        }
    )
    .add(
        "uhe#fract32",
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
