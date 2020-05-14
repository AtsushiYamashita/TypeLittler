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

    private _instance = new Observer<T>();
    private static readonly  _rooter: Map<Injecter<any>> = {};

    public static inject <T, K1 extends string>(c: Constructor<T>, key: K1, k = c.name): Injecter<T> {
        const rooter = Injecter._rooter;
        if (!!rooter[k + key]) return rooter[k + key];
        const obj = new Injecter<T>(c, k);
        rooter[obj.name + key] = obj;
        return obj;
    }

    public static provide <T, K1 extends string>(c: Constructor<T>, key: K1, k = c.name): Injecter<T>|undefined {
        const rooter = Injecter._rooter;
        return rooter[k + key];
    }

    constructor(c: Constructor<T>, alias?: string) {
        super(c, alias);
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
        type R = T[K];
        return (self: T): R => self[key];
    }
}



// const a = (v:SafeValue<number>) => new Injecter(SafeValue)
// .call("push")(v)


// export class Provider {

//     public static inject<T>(cstr: Constructor<T>) {
//         const id = new Identity<T>(cstr);
//         const not_found = !_rooter[id._identity];
//         if (not_found) {
//             _rooter[id._identity] = new Provider(id)
//         }
//         return _rooter[id._identity];
//     }

//     public static get<T>(
//         cns: Constructor<T>,
//         key: string): Observer<T> {
//         const typed = this.inject(cns);
//         return typed.get<T>(key);
//     }

//     // tslint:disable-next-line variable-name
//     private _obj: Map<IProvideData> = {};

//     constructor(private _id: IIdentyty) {}

//     public allocate<T>(key: string): Observer<T> {
//         const id_key = key;
//         if (!this._obj[id_key]) {
//             const val = new Observer<T>();
//             this._obj[id_key] = { key: id_key, val }
//         }
//         return this._obj[id_key].val
//     }

//     public get<T>(key: string): Observer<T> {
//         const obj = this.allocate<T>(key);
//         if (obj.holder.is_null() === false) return obj;
//         console.log("create");
//         obj.push(["init_173106", this._id._constructor()]);
//         return obj;
//     }
// }


// const _rooter = new Observer<Injecter<any>>();


export default Injecter;

