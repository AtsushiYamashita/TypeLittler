import { SafeHolder, Observer } from "#/classes/Observe"
import * as _ from "lodash"

describe('SafeHolder', () => {

    test('is_null', () => {
        const holder = new SafeHolder();
        expect(holder.is_null()).toBe(true);
        const holder1 = new SafeHolder(1);
        expect(holder1.is_null()).toBe(false);
    });

    test('value', () => {
        const holder = new SafeHolder();
        expect(holder.value()).toHaveLength(0);

        const holder1 = new SafeHolder(1);
        expect(holder1.value()).toContain(1);
    })

    test('update', () => {
        const holder = new SafeHolder();
        expect(holder.value()).toHaveLength(0);
        holder.update(0);
        expect(holder.value()).toContain(0);
        holder.update(1);
        expect(holder.value()).toContain(1);
    })

    test('reject', () => {
        const holder = new SafeHolder<any>();
        expect(holder.value()).toHaveLength(0);
        holder.add_rejector(_.isNull)

        expect(holder.update(0)).toBe(true);
        expect(holder.value()).toContain(0);

        expect(holder.update(null)).toBe(false);
        expect(holder.value()).toContain(0);
    })
})


describe('Observer', () => {

    test('add_shot no_delay', (done) => {
        const obs = new Observer(0);
        obs.add_shot(v => expect(v).toBe(0));
        return done();
    });

    test('add_shot delay', (done) => {
        const obs = new Observer();
        obs.add_shot(v => expect(v).toBe(1));
        obs.update(1);
        return done();
    });

    test('start_chain bare', (done) => {
        const obs = new Observer(0);
        expect(obs.start_chain()).resolves.toBe(0);
        return done();
    });

    test('start_chain use', (done) => {
        const obs = new Observer(0);
        expect(obs.start_chain().then(_ => 1)).resolves.toBe(1);
        expect(obs.holder.value()).toContain(0);
        done();
    });

    test('add_notify ', (done) => {
        let callee = 0;
        const obs = new Observer<number>();
        obs.add_notify(_=>callee++);
        obs.holder.add_rejector(v=>v%2 === 0);
        _.times(10).forEach(e=>obs.update(e));
        expect(callee).toBe(5);
        done();
    });
})
