import * as _ from "lodash"

import Provider from "#/classes/Injecter"

class Injected {
    public number = 0;
    func(ret: string) { return ret + "!"; }
}

const ProvideKey = {
    No1: "No1",
    No2: "No2",
} as const;

describe('Injected', () => {

    beforeAll((done) => {
        const a = Provider.inject(Injected, ProvideKey.No1);
        const b = Provider.inject(Injected, ProvideKey.No2);
        [a, b].forEach(e => e.rejecter
            .reject(_.isNull)
            .reject(_.isUndefined));

        const t = new Injected();
        t.number = 10;
        a.push(t);
        b.push(new Injected())

        // 反映はされている
        // 変更通知のためにnotify
        a.notify();

        return done();
    });

    test('get number', async (done) => {
        const a = Provider.provide(Injected, ProvideKey.No1);
        if (!a) return fail();
        a.event
            .chain()
            .then(e => e.number)
            .then(expect(10).toBe);

        const b = Provider.provide(Injected, ProvideKey.No2);
        if (!b) return fail();
        b.event
            .chain()
            .then(e => e.number)
            .then(expect(0).toBe);
        return done();
    });

    test('get func', async (done) => {
        const a = Provider.provide(Injected, ProvideKey.No1);
        if (!a) return fail();
        const val = a.head;
        expect(!!val).toBe(true);

        if (!val) return done();
        const func = a.call("func")(val);
        expect(func("injected")).toBe("injected!");

        return done();
    });

    afterAll(() => { });

    // test('type declare only', (done) => {
    //     const key = "zero";
    //     const d1: Type1 = {
    //         val: "type1.val",
    //         func: () => "type1.func"
    //     }
    //     const o1 = Provider.allocate<Type1>(key);
    //     expect(o1.holder.value()).toHaveLength(0);
    //     o1.push(["init", d1]);

    //     const o2 = Provider.get<Type1>(key);
    //     expect(o2.holder.value()).toHaveLength(1);
    //     expect(o1.holder.value()).toHaveLength(1);
    //     o1.add_shot(v => expect(v).toBe(o2.holder.value()[0]));
    //     return done();
    // });

    // test('type declare only', (done) => {
    //     const key = "zero";
    //     const d1: Type2 = new Type2("type2", () => "type2.func")
    //     const o1 = Provider.allocate<Type2>(key);
    //     expect(o1.holder.value()).toHaveLength(0);
    //     o1.push(["init", d1]);

    //     const o2 = Provider.get<Type2>(key);
    //     expect(o2.holder.value()).toHaveLength(1);
    //     expect(o2.holder.value()[0].val).toBe("type2");
    //     expect(o1.holder.value()).toHaveLength(1);

    //     o1.add_shot(v => expect(v).toBe(o2.holder.value()[0]))
    //     return done();
    // });

})


test("", () => { })
