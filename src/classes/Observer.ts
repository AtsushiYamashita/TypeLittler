import { Func, Set } from "shorter-dts"
import * as _ from "lodash"

type Pack<V> = Set<string, V>
type Notify<V> = Func<Pack<V>, void>;
type Validater<V> = Func<Pack<V>, boolean>;

type Rejector<V> = Func<V, boolean>;
type Apply<V> = Func<V, void>;

export class SafeHolder<V>  {
   private _observed: Pack<V>[];
   private _validater: Validater<V>[];

   constructor(v?: V, private length: number = 1) {
      this._observed = _.isNull(v) || _.isUndefined(v) ? [] : [["init", v]];
      this._validater = [];

      this.value = this.value.bind(this);
      this.unset = this.unset.bind(this);
      this.is_null = this.is_null.bind(this);

      this.push = this.push.bind(this);
      this.update = this.update.bind(this);

      this.add_rejector = this.add_rejector.bind(this);
      this.add_validater = this.add_validater.bind(this);
   }

   value(): V[] {
      const head = _.head(this._observed);
      return !!head ? [head[1]] : [];
   }

   is_null(): boolean {
      return !_.head(this._observed);
   }

   push(pack: Pack<V>, cb: Func<Pack<V>, any>): boolean {
      const val = pack[1];
      const current = this.value()[0];

      const same_value = _(current)
         .isEqual(val);
      if (same_value) return false;

      const rejected = _(this._validater)
         .map(f => f(pack))
         .filter()
         .value().length;
      if (rejected > 0) return false;

      this._observed = this._observed
         .concat([pack])
         .slice(-this.length);
      cb(pack);
      return true;
   }

   update(v: V): boolean {
      return this.push(["update", v], v => v);
   }

   unset(): void {
      this._observed = [];
   }

   add_validater(f: Validater<V>): SafeHolder<V> {
      this._validater.push(f);
      return this;
   }

   add_rejector(f: Rejector<V>): SafeHolder<V> {
      this._validater.push(e => f(e[1]));
      return this;
   }
}

export interface IObserver<V> {
   add_shot(f: Apply<V>): IObserver<V>;
   start_chain(): Promise<V>;
   add_notify(f: Notify<V>): IObserver<V>;
   push(pack: Pack<V>): boolean;
   update(v: V): boolean;
   holder: SafeHolder<V>;
};

export class Observer<V> implements IObserver<V>{
   private _holder: SafeHolder<V>;
   private _notify: Notify<V>[];
   private _shot: Apply<V>[];

   static start_chain<V>(): Promise<V> {
      const ret = new Observer<V>();
      return ret.start_chain();
   }

   constructor(v?: V, length: number = 1) {
      this._holder = new SafeHolder(v, length);
      this._notify = [];
      this._shot = [];

      this.update = this.update.bind(this);
      this.push = this.push.bind(this);
      this.start_chain = this.start_chain.bind(this);
      this.add_shot = this.add_shot.bind(this);
      this.add_notify = this.add_notify.bind(this);
   }

   get holder(): SafeHolder<V> {
      return this._holder;
   }

   /** seal */
   set holder(v: SafeHolder<V>) { }

   update(v: V): boolean {
      return this.push(["update", v]);
   }

   push(pack: Pack<V>): boolean {
      return this._holder.push(pack, (pack) => {
         this._notify.forEach(f => f(pack));
         this._shot.forEach(f => f(pack[1]));
         this._shot = [];
      });
   }

   start_chain(): Promise<V> {
      return new Promise<V>((res, _) => {
         if (this._holder.is_null()) return this._shot.push(res);
         res(this._holder.value()[0]);
      });
   }

   add_shot(f: Apply<V>): IObserver<V> {
      if (this._holder.is_null()) {
         this._shot.push(f);
         return this;
      }
      f(this._holder.value()[0]);
      return this;
   }

   add_notify(f: Notify<V>): IObserver<V> {
      this._notify.push(f);
      return this;
   }
}

export default Observer;

