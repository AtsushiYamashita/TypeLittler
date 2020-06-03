import { v5 as uuidv5 } from 'uuid';

export const uuid_v5 = (
    name: string,
    namespace: string | Array<string | number>): readonly [string, string] => {
    const ns = typeof namespace === "string" ? namespace : namespace.join("");
    const left: string = ns.length < 16 ? "Too short" : "";
    const right = left.length < 1 ? uuidv5(name, ns) : "";
    return [left, right] as const
}


