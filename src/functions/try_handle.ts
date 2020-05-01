import { Func, Set } from "shorter-dts"

export function try_handle<A, R>(
    tryf: Func<A, R>,
    err_code: number,
    val: A
): Set<any[], R[]> {
    try {
        return [[], [tryf(val)]];
    } catch (e) {
        return [[`${err_code} >>> ${e}`], []]
    }
};
export default try_handle;
