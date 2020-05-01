import try_handle from "#/functions/try_handle"
import * as _ from "lodash"

const thrower = (n: number) => { if (n < 1) throw new Error("message"); return n; }

test('try_handle@simple thrower', () => {
    const casef = try_handle(thrower, 100, 0);
    const casep = try_handle(thrower, 101, 1);
    expect(casef[0]).toHaveLength(1);
    expect(casef[1]).toHaveLength(0);
    expect(casep[0]).toHaveLength(0);
    expect(casep[1]).toHaveLength(1);
});

test('try_handle@simple thrower cb fail', () => {
    const casef = try_handle(thrower, 100, 0);

    casef[0].forEach(err=>expect(err).toContain("100"))
    casef[1].forEach(res=>expect(res).toBe("unhappen"))
});

test('try_handle@simple thrower cb pass', () => {
    const casep = try_handle(thrower, 101, 1);

    casep[0].forEach(err=>expect(err).toContain("unhappen"))
    casep[1].forEach(res=>expect(res).toBe(1))
});
