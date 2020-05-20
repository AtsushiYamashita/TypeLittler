import * as _ from "lodash"

import ConditionalCache, { CaseAction } from "#/classes/ConditionalCache"

class Sample {
    constructor(public num: number) { }
}

describe('ConditionalCache', () => {

    test('most simple case number', async (done) => {
        const dat = new ConditionalCache<number>();
        dat.add_condition(new CaseAction(0, _ => true, _ => 0));
        expect(dat.value.is_null).toBe(true);
        expect(dat.load("")).toBe(true);
        expect(dat.value.is_null).toBe(false);
        expect(dat.value.head).toBe(0);
        return done();
    });

    test('most simple case class', async (done) => {
        const dat = new ConditionalCache<Sample>();
        dat.add_condition(new CaseAction(0, _ => true, _ => new Sample(0)));
        expect(dat.value.is_null).toBe(true);
        expect(dat.load("")).toBe(true);
        expect(dat.value.is_null).toBe(false);
        expect(dat.value.tap().num).toBe(0);
        return done();
    });

    test('ordered case 0', async (done) => {
        const dat = new ConditionalCache<number>();
        dat.add_condition(new CaseAction(0, _ => true, _ => 0));
        dat.add_condition(new CaseAction(1, _ => true, _ => 1));
        expect(dat.load("")).toBe(true);
        expect(dat.value.head).toBe(1);
        return done();
    });

    test('ordered case 1', async (done) => {
        const dat = new ConditionalCache<number>();
        dat.add_condition(new CaseAction(0, _ => true, _ => 0));
        dat.add_condition(new CaseAction(1, _ => true, _ => 1));
        expect(dat.load("")).toBe(true);
        expect(dat.value.head).toBe(1);
        dat.add_condition(new CaseAction(2, _ => true, _ => 2));
        expect(dat.value.head).toBe(1);
        expect(dat.load("")).toBe(true);
        expect(dat.value.head).toBe(2);
        return done();
    });

    test('ordered case 1', async (done) => {
        const dat = new ConditionalCache<number>();
        dat.add_condition(new CaseAction(0, _ => true, _ => 0));
        dat.add_condition(new CaseAction(1, ([state, val]) => val !== undefined, _ => 1));
        expect(dat.load("")).toBe(true);
        expect(dat.value.head).toBe(0);
        expect(dat.load("")).toBe(true);
        expect(dat.value.head).toBe(1);
        return done();
    });
})


test("", () => { })
