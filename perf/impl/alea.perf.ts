import { Event, Suite } from "benchmark"
import { alea } from "../../src/impl/alea"

const suite = new Suite()
const async = true
const config = { async }

const stream = alea.streamFrom("seed")
const state = alea.from("seed")

// Tests
suite
    .add(
        "Math.random",
        (): void => {
            Math.random()
        }
    )
    .add(
        "alea#nextFract32",
        (): void => {
            stream.nextFract32()
        }
    )
    .add(
        "alea#fract32",
        (): void => {
            alea.fract32(state)
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
