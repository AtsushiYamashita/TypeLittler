import { isArray } from "util";
import { Act, Func, Map } from "shorter-dts"


type tpva = [string, string, any]
export class PathValue {
    constructor(
        public type: string,
        public path: string,
        public value: any) { }

    static arr(arr: PathValue[]): [PathValue[], Act<tpva>] {
        return [arr, (tpva: tpva) => {
            const [t, p, v] = tpva;
            arr.push(new PathValue(t, p, v));
        }]
    }

    static open(dat: any): {
        arr: PathValue[],
        push: Func<tpva, any>
    } {
        const [arr, push] = PathValue.arr([])
        function open(parent: string, val: any) {
            if (isArray(val)) { push(["array", parent, val.length]); val.map(e => open(parent + "::[]", e)); return; }
            if (typeof val === "object") { const obj = Object.entries(val); push([typeof val, parent, obj.length]); obj.map(e => (open(parent + "::" + e[0], e[1]))); return; }
            if (typeof val === "function") { push([typeof val, parent, val.toString()]); return; }
            push([typeof val, parent, val]);
        }
        open("root", dat);
        return { arr, push }
    }
}

export default PathValue;

// const sample = { "test0": undefined, "test1": 1, test2: [2, 3, { aaa: "bbb", cc: ["dd", (e: any) => e] }] }
// console.log(TypedPathValue.open(sample).arr)
