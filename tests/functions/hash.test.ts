import * as _ from "lodash"
import * as Hash from "#/functions/hash";
import { sampledata } from "../testdata"

// 463bd88

// Cannot test current version for bigint
const ct = Date.now();
const tohash = (s: string) => Hash.little_hash(s, ct)

describe('short hash matching', () => {
    test('no_len', () => {
        const d1 = tohash("")
        const d2 = tohash("")
        expect(d1).toBe(d2);
    });

    sampledata.num.forEach((data, i) => {
        test('num_set:' + i, () => {
            const d1 = tohash("" + data);
            const d2 = tohash("" + data);
            expect(d1).toBe(d2)
        });
    })


    sampledata.str.forEach((data, i) => {
        test('str_set:' + i, () => {
            const d1 = tohash(data);
            const d2 = tohash(data);
            expect(d1).toBe(d2)
        });
    })

    sampledata.arr.forEach((data, i) => {
        test('arr_set:' + i, () => {
            const d1 = tohash(data.join("_"));
            const d2 = tohash(data.join("_"));
            expect(d1).toBe(d2)
        });
    })

    sampledata.obj.forEach((data, i) => {
        test('obj_set:' + i, () => {
            const d1 = tohash(JSON.stringify(data));
            const d2 = tohash(JSON.stringify(data));
            expect(d1).toBe(d2)
        });
    })

    sampledata.other.forEach((data, i) => {
        test('other_set:' + i, () => {
            const d1 = tohash(JSON.stringify(data));
            const d2 = tohash(JSON.stringify(data));
            expect(d1).toBe(d2)
        });
    })
})

test('hashx', () => {
    const d = Hash.hashx("abcdefg", 100, 5);
    const res = "4c0efb80";
    expect(d).toBe(res);
});

test('hashx', () => {
    const d = Hash.hashx("abcdefg\n", 100, 5);
    const res = "4c0efb80";
    expect(d).not.toBe(res);
});
