import * as _ from "lodash"

import { Func, Set, Unsafe } from "shorter-dts";
import { Observer } from "./Observer"

export class CaseAction<T, S> {
    constructor(
        public order: number,
        public when: Func<Set<S, Unsafe<T>>, boolean>,
        public injector: Func<any, T>
    ) { }
}

export interface IConditinalCache<T, S> {
    value: Observer<T>;
    add_condition(cond: CaseAction<T, S>): this;
    load(state: S): boolean;
}

export class ConditinalCache<T, S = ""> implements IConditinalCache<T, S> {
    private readonly _val: Observer<T> = new Observer<T>();
    private readonly _conditions: CaseAction<T, S>[] = [];

    constructor() {
        this.add_condition = this.add_condition.bind(this);
        this.load = this.load.bind(this);
    }

    get value(): Observer<T> {
        return this._val;
    }

    add_condition(cond: CaseAction<T, S>): this {
        this._conditions.push(cond);
        this._conditions.sort((a, b) => b.order - a.order);
        return this;
    }

    load(state: S): boolean {
        const matched = _.chain(this._conditions)
            .filter(e => e.when([state, this._val.head]))
            .filter((_, i) => i < 1).value() || [];
        if (matched.length < 1) return false;
        const v = matched[0].injector(this);
        const ret = this._val.push(v);
        return ret;
    }
}

export default ConditinalCache;
