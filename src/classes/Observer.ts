import { Func, Set } from "shorter-dts"
import * as _ from "lodash"

// export type PackMethod = "Init" | "Update" | "Reset";
// type Pack<V> = Set<PackMethod, V>;
// type Notify<V> = Func<Pack<V>, EventStatus>
// type Validater<V> = Func<Pack<V>, boolean>;
type Notify<V> = Func<V, any>
type Assertional<V> = Func<V, boolean>;

export class Rejector<V>{
   private _validater: Assertional<V>[];

   constructor() {
      this._validater = [];

      this.reject = this.reject.bind(this);
      this.assert = this.assert.bind(this);
      this.check_reject = this.check_reject.bind(this);
   }

   public assert(f: Assertional<V>): Rejector<V> {
      this._validater.push(e => !f(e));
      return this;
   }

   public reject(f: Assertional<V>): Rejector<V> {
      this._validater.push(e => f(e));
      return this;
   }

   public check_reject(pack: V) {
      const rejected = _(this._validater)
         .map(f => f(pack))
         .filter()
         .value().length;
      if (rejected > 0) return true;
      return false;
   }
}

export class Event<V> {
   private _notify: Notify<V>[];
   private _shot: Func<V, any>[];

   constructor(private readonly _observer: Observer<V>) {
      this._notify = [];
      this._shot = [];

      this.fire = this.fire.bind(this);
      this.chain = this.chain.bind(this);
      this.add_shot = this.add_shot.bind(this);
      this.add_notify = this.add_notify.bind(this);
   }

   public fire(val: V) {
      this._notify = this._notify
         .map(f => [f(val), f] as Set<any, Notify<V>>)
         .filter(e => !!e[0])
         .map(e => e[1]);
      this._shot.forEach(f => f(val));
      this._shot = [];
   }

   public chain(): Promise<V> {
      const obs = this._observer;
      return new Promise<V>((res, _) => {
         if (obs.is_null) return res(obs.value[1]);
         return this._shot.push(p => res(p));
      });
   }

   public add_shot(event: Func<V, any>): Observer<V> {
      const obs = this._observer;
      if (!!obs.head) return event(obs.head) ? this._observer : this._observer;
      this._shot.push(event);
      return this._observer;
   }

   public add_notify(event: Notify<V>): Observer<V> {
      this._notify.push(event);
      return this._observer;
   }
}


export interface ISafeValue<V> {
   value: V[];
   head?: V;
   is_null: boolean;
}

export class SafeValue<V> implements SafeValue<V> {
   private _observed: V[];

   constructor(private readonly _length: number) {
      this._observed = [];

      this.unset = this.unset.bind(this);
      this.update = this.update.bind(this);
   }

   public get value(): V[] {
      return this.is_null ? [] : [this._observed[0]];
   }

   public get head(): V | undefined {
      return this._observed[0];
   }

   public get is_null(): boolean {
      return this._observed.length < 1;
   }

   public tap(func: Func<V[], V> = e => e[0]): V {
      return func(this._observed)
   }

   protected update(pack: V) {
      this._observed = this._observed
         .concat([pack])
         .slice(-this._length);
   }

   public unset(): void {
      this._observed = [];
   }
}

export interface IObserver<V> extends ISafeValue<V> {
   push(val: V): boolean;
   event: Event<V>;
   rejecter: Rejector<V>;
}

export class Observer<V>
   extends SafeValue<V>
   implements IObserver<V> {
   public readonly event: Event<V>;
   public readonly rejecter: Rejector<V>;

   public static chain<V>(): Promise<V> {
      const ret = new Observer<V>();
      return ret.event.chain();
   }

   public static init<V>(v: V) {
      const ret = new Observer<V>();
      ret.push(v);
      return ret;
   }

   constructor(length: number = 1) {
      super(length);
      this.event = new Event(this);
      this.rejecter = new Rejector();

      this.push = this.push.bind(this);
   }

   public push(val: V): boolean {
      const not_null = this.is_null === false;
      const is_same = () => _(this.head).isEqual(val)
      if (not_null && is_same()) return true;

      const rejected = this.rejecter.check_reject(val);
      if (rejected) return false;

      super.update(val);
      this.event.fire(val);
      return true;
   }
}

export default Observer;
