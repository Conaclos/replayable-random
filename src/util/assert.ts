// Copyright (c) 2019 Victorien Elvinger
// Licensed under the zlib license (https://opensource.org/licenses/zlib).

/**
 * @internal
 * @param test
 * @param msg reported message if {@link test } fails.
 */
export const assert = (test: boolean, msg: string) => {
    if (!test) {
        throw new Error(msg)
    }
}
