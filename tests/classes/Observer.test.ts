import { Observer } from "#/classes/Observer"

import * as _ from "lodash"

describe('SafeHolder', () => {

    test('is_null', () => {
        const holder = new Observer<number>();
        expect(holder.is_null).toBe(true);
        const holder1 = Observer.init(1);
        expect(holder1.is_null).toBe(false);
    });

    test('value', () => {
        const holder = Observer.init(0);
        expect(holder.value).toHaveLength(1);

        const holder1 = Observer.init(1);
        expect(holder1.value).toContain(1);
    });

    test('update', () => {
        const holder = new Observer<number>();
        expect(holder.value).toHaveLength(0);
        holder.push(0);
        expect(holder.value).toContain(0);
        holder.push(1);
        expect(holder.value).toContain(1);
    });

    test('reject', () => {
        const obs = new Observer<any>();
        expect(obs.value).toHaveLength(0);
        obs.rejecter.reject(_.isNull)
        obs.rejecter.assert(_.isNumber)

        expect(obs.push(0)).toBe(true);
        expect(obs.value).toContain(0);

        expect(obs.push(null)).toBe(false);
        expect(obs.value).toContain(0);
    });
})


describe('Observer', () => {

    test('add_shot no_delay', (done) => {
        const obs = Observer.init(0);
        obs.event.add_shot(v => expect(v).toBe(0));
        return done();
    });

    test('add_shot delay', (done) => {
        const obs = new Observer<number>();
        obs.event.add_shot(v => expect(v).toBe(1));
        obs.push(1);
        return done();
    });

    test('start_chain bare', (done) => {
        const obs = Observer.init(0);
        expect(obs.event.chain())
            .resolves.toBe(0);
        return done();
    });

    test('start_chain use', (done) => {
        const obs = Observer.init(0);
        expect(obs.event.chain().then(_ => 1))
            .resolves.toBe(1);
        expect(obs.value).toContain(0);
        done();
    });

    test('add_notify ', (done) => {
        let callee: number[] = [];
        const obs = Observer.init(0);
        obs.event.add_notify(e=>callee.push(e) );
        obs.rejecter
            .reject(v => v % 2 === 0)
            .reject(v => v === 0);
        _.times(10).forEach(e => obs.push(e));
        expect(callee).toHaveLength(5);
        done();
    });
})
