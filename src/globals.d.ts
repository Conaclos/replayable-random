
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/console
 */
interface Console {
    readonly assert: (test: boolean, message?: string, ...objs: any[]) => void

// profiling
    readonly time: (label?: string) => void

    readonly timeEnd: (label?: string) => void

// Debugging
    readonly log: (message?: string, ...objs: any[]) => void

    readonly table: (obj: object) => void

    readonly trace: () => void

    readonly count: (label?: string) => uint32

// Logging
    readonly info: (message?: string, ...objs: any[]) => void

    readonly warn: (message?: string, ...objs: any[]) => void

    readonly error: (message?: string, ...objs: any[]) => void

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
