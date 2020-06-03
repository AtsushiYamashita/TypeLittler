import { Map } from "shorter-dts"
import * as _ from "lodash"

export enum TestEnum { test }

const num_obj = (p: Map<number>, c: number) => { p["" + c] = c; return p }
const enum_obj = <K, V>(p: Map<V>, [k, v]: [K, V]) => _.assign(p, { k: v });

export const sampledata = {
    num: [-1, 0, 1, 100, -412412, 2412532543,Math.PI],
    str: ["", "a", "\n", "\b", _.times(1000).join("_")],
    arr: [[], [, ,], [, , 3], [0], [0, 1, 2,], _.times(1000)],
    obj: [{},
    _.times(1000).reduce(num_obj, {}),
    Object.entries(TestEnum).reduce(enum_obj, {}),
    { test: 0, },
    { ia: [{}, { a: 0 }], },
    { deep: { d1: { d1a: {} }, d2: {} } }
    ],
    other: [
        undefined,
        null,
        () => { },
        TestEnum,
        _,
        /(.+)/,
        NaN,
        Date.now()
    ],
}

export default sampledata
