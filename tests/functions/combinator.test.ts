import * as _ from "lodash"

import {
    combinator,
    on_break
} from "#/functions/combinator"


describe('combinator', () => {

    test('add1', () => {
        const target = combinator<number>('add1')
        .mix(v => v + 1).app;

        expect(target(0)[1]).toHaveLength(1);
        expect(target(0)[1][0]).toBe(1);
        expect(target(1)[1][0]).toBe(2);
    });


    test('add1s1', () => {
        const target = combinator<number>('add1s1')
        .mix(v => v + 1)
        .mix(v => v + "")
        .mix(v => v + 1)
        .app;

        expect(target(0)[1]).toHaveLength(1);
        expect(target(0)[1][0]).toBe("11");
        expect(target(1)[1][0]).toBe("21");
    });


    test('0e1', () => {
        const target =combinator<number>('0e1')
        .mix(v => v + 1)
        .mix(v => { throw new Error('e00') }, '2')
        .mix(v => v + "")
        .mix(v => v + 1)
        .app;

        expect(target(0)[0]).toHaveLength(2);
        expect(target(0)[1]).toHaveLength(0);
    });


    test('fizzbuzz', () => {
        const not_num = (v:any) => typeof v !== "number"
        const target =combinator<number>('fizzbuzz')
        .mix(v => v <= 0 ? ""+v:v).br<number>(not_num)
        .mix(v => v % 15 === 0 ? "fizzbuzz":v).br<number>(not_num)
        .mix(v => v % 3 === 0 ? "fizz":v).br<number>(not_num)
        .mix(v => v % 5 === 0 ? "buzz":v).br<number>(not_num)
        .mix(v => v + ""+v)
        .app;
        const clen = (v: any[], len: number) => expect(v).toHaveLength(len);
        const ceql = (v: any[], id: number, dat: any) => expect(_(v[id]).isEqual(dat)).toBe(true);


        _.times(100)
        .map(v=>[v-5,target(v-5)] as const )
        .map(([i,[e,v]])=>[i,e,v,[clen(v,1)]] as const)
        .map(([i,e,v])=>i>0&&i%15===0?[i,e,v,[clen(e,1),ceql(e,0,on_break),ceql(v,0,"fizzbuzz")]] as const:[i,e,v] as const)
        .filter(a=>a.length<3)
        .map(([i,e,v])=>i>0&&i%5===0?[i,e,v,[clen(e,1),ceql(e,0,on_break),ceql(v,0,"buzz")]]as const:[i,e,v] as const)
        .filter(a=>a.length<3)
        .map(([i,e,v])=>i>0&&i%3===0?[i,e,v,[clen(e,1),ceql(e,0,on_break),ceql(v,0,"fizz")]]as const:[i,e,v] as const)
        .filter(a=>a.length<3)
        .map(([i,e,v])=>[i,expect(""+i).toBe(v)] as const)
    });
})

