// Compile with --strictBindCallApply

import * as _ from "lodash"
import { Func, Map } from "shorter-dts"
import { Observer, IObserver, Event, Rejector } from "./Observer"

type Constructor<T> =
    | { new(...args: any[]): T }
    | ((...args: any[]) => T)
    | Function;


export interface IIdentyty {
    readonly name: string;
    readonly _constructor: Function;
}


export class Identity<T> implements IIdentyty {

    public readonly name: string;
    public readonly _constructor: Constructor<T>;

    constructor(c: Constructor<T>, alias?: string) {
        this.name = alias || c.name;
        this._constructor = c;
    }
    public get fake(): T { return undefined as any as T; }
}


export class Injecter<T>
    extends Identity<T>
    implements IObserver<T> {

    private static readonly _rooter: Map<Injecter<any>> = {};

    public static inject<T, K1 extends string>(c: Constructor<T>, key: K1, k = c.name): Injecter<T> {
        const rooter = Injecter._rooter;
        if (!!rooter[k + key]) return rooter[k + key];
        const obj = new Injecter<T>(c, k);
        rooter[obj.name + key] = obj;
        return obj;
    }

    public static provide<T, K1 extends string>(c: Constructor<T>, key: K1, k = c.name): Injecter<T> | undefined {
        const rooter = Injecter._rooter;
        return rooter[k + key];
    }

    private _instance = new Observer<T>();

    constructor(c: Constructor<T>, alias?: string) {
        super(c, alias);
        this.notify = this.notify.bind(this);
        this.push = this.push.bind(this);
        this.call = this.call.bind(this);
    }

    public get value(): T[] { return this._instance.value; };
    public get head(): T | undefined { return this._instance.head; };
    public get is_null(): boolean { return this._instance.is_null; };
    public get event(): Event<T> { return this._instance.event };
    public get rejecter(): Rejector<T> { return this._instance.rejecter };

    public notify(): void {
        this.head && this.push(this.head);
    }

    public push(val: T): boolean {
        return this._instance.push(val);
    }

    public call<K extends keyof T = keyof T>(key: K): Func<T, T[K]> {
        return (self: T): T[K] => self[key];
    }
}

export default Injecter;

