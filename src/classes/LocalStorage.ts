import * as _ from "lodash";

import { Injecter } from "./Injecter"
import { combinator } from "../functions/combinator"
import { hashx } from "../functions/hash"

const Keywords = {
    StorageTest: "__storage_test__",
    TargetStorage: "localStorage",
    ItemHash: "&datahash",
    ItemUpdated: "&lastupdated",
    IsNull: "IsNull"
} as const;

export class LocalStorage {
    private memo: (((k: any) => any) & _.MemoizedFunction)
    private updated: string[] = []

    public static setup(window: Window & typeof globalThis, url: string) {
        const x = Keywords.StorageTest;
        const storage = window[Keywords.TargetStorage]
        const tester: {
            err?: { e: DOMException, msg: string },
            storage?: LocalStorage
        } = {};
        try {
            storage.setItem(x, x);
            storage.removeItem(x);
        } catch (e2) {
            (e2 => {
                const e = e2 as DOMException;
                tester.err = { e, msg: "Illigal error 2." }
                if (!e) return tester.err.msg = "Illigal error.";
                if (e.code === 22) return tester.err.msg = "everything except Firefox";
                if (e.code === 1014) return tester.err.msg = "Firefox";
                if (e.name === 'QuotaExceededError') return tester.err.msg = "test name field";
                if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') return tester.err.msg = "there's something already stored";
            })(e2)
        }
        tester.storage = (() => {
            if (!tester.err) return undefined;
            return new LocalStorage(storage, url);
        })()
        return tester
    }

    private constructor(
        private _storage: Storage,
        private _url: string) {
        this.memo = _.memoize(k => _storage[_url][k])
    }

    push() { }
    pull() { }

    check_hash() {
        const hash_key = this._url + Keywords.ItemHash;
        const local_hash = this._storage[hash_key];
        const remote_hash = "";
        const no_local = local_hash === undefined;
        const no_remote = "".length < 1;

        if (no_local && no_remote) {
            const [e, hashed] = combinator<string>(this.check_hash.name)
                .mix(this._storage.getItem)
                .fix<string>(_.isNull, Keywords.IsNull)
                .mix(hashx)
                .app(this._url);
            const write = combinator<[string, string]>("write")
                .mix(([k, v]) => this._storage.setItem(k, v))
                .app;
            write([hash_key, hashed[0]])
            return;
        }
    }

    sync() {
        const now = Date.now();
        const time_key = this._url + Keywords.ItemUpdated;
        const base = "";
        const updated = this._storage[time_key];
        if (updated === undefined) {
            this.set(time_key, "" + now);
            return;
        }
        if (base !== updated) {
            //TODO sync online sotrage
        }
    }

    get(key: string) {
        return this.memo(key);
    }

    set(key: string, value: string) {
        if (this.memo(key) === value) return this;
        this._storage.setItem(key, value);
        this.memo.cache.set(key, value);
        this.updated.push(key);
        return this;
    }
}

export const InjectKey = { DefaultStorage: "DefaultStorage" } as const;

const holder = Injecter.inject(LocalStorage, InjectKey.DefaultStorage);
holder.rejecter
    .reject(_.isNull)
    .reject(_.isUndefined);
const def = LocalStorage.setup(window, "default");
def.storage && holder.push(def.storage);

export default LocalStorage;
