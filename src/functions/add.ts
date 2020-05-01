import * as _ from "lodash";

export function sum(a: number, b: number) {
    return a + b;
};

export function append<V>(a: string, v: V) {
    if (_.isUndefined(v)) return a + " undefined ";
    if (_.isNull(v)) return a + " null ";
    if (_.isFunction(v)) return a + `'${v.toString()}'`;
    return a + v;
};
