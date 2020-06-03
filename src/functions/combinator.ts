import { try_handle } from "./try_handle"
import { Func, Set } from "shorter-dts"

type ErrorKey = string | number;

export const on_break: unique symbol = Symbol("Break");

export const combinator = <A>(name: ErrorKey) => {
    const imp = <R>(fa: Func<Set<any[], A[]>, Set<any[], R[]>>) => {
        const mix = <R2>(f: Func<R, R2>, ec = name) => imp((v: Set<any[], A[]>) => {
            const [e0, r0] = v;
            if (e0.length > 0 || r0.length < 1) return [e0, r0 as any[] as R2[] || []];
            const [e1, r1] = fa(v);
            if (e1.length > 0) return [e1, r1 as any[] as R2[] || []];
            const n = try_handle(f, ec === name ? ec : `${name}.${ec}`, r1[0]);
            return n;
        });
        const app = (v: A) => fa([[], [v]]);
        const br = <R2 = R>(con: Func<R, boolean>) => imp((v: Set<any[], A[]>): Set<any[], R2[]> => {
            const [e0, r0] = v;
            if (e0.length > 0 || r0.length < 1) return [e0, r0 as any[] as R2[] || []];
            const [e1, r1] = fa(v);
            if (e1.length > 0) return [e1, r1 as any[] as R2[] || []];
            return [con(r1[0]) ? [on_break] : [], r1 as any[] as R2[] || []];
        });
        const fix = <R2 = R>(con: Func<R, boolean>, fixed: R2) => imp((v: Set<any[], A[]>): Set<any[], R2[]> => {
            const [e0, r0] = v;
            if (e0.length > 0 || r0.length < 1) return [e0, r0 as any[] as R2[] || []];
            const [e1, r1] = fa(v);
            if (e1.length > 0) return [e1, r1 as any[] as R2[] || []];
            return [[], con(r1[0]) ? r1 as any[] as R2[] || [] : [fixed]];
        });
        const brsome = (...obj: R[]) => br(e => obj.some(o => o === e));
        return { mix, app, br, brsome, fix }
    }
    return imp(v => v);
};

export default combinator
