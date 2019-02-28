/* eslint-disable no-shadow */

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/console
 */
interface Console {
    readonly assert: (test: boolean, ...objs: unknown[]) => void

    // profiling
    readonly time: (label?: string) => void

    readonly timeEnd: (label?: string) => void

    // Debugging
    readonly log: (...objs: unknown[]) => void

    readonly table: (obj: object) => void

    readonly trace: () => void

    readonly count: (label?: string) => number

    // Logging
    readonly info: (...objs: unknown[]) => void

    readonly warn: (...objs: unknown[]) => void

    readonly error: (...objs: unknown[]) => void

    readonly group: (label?: string) => void

    readonly groupCollapsed: (label?: string) => void

    readonly groupEnd: () => void

    // Other
    readonly clear: () => void
}

declare const console: Console

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
 */
interface TextEncoder {
    readonly encode: (s: string) => Uint8Array
}

declare const TextEncoder: {
    new (): TextEncoder

    prototype: TextEncoder
}
