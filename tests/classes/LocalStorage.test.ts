import { LocalStorage } from "#/classes/LocalStorage"
import { sampledata } from "../testdata"

class MockStorage implements Storage {
    private _dat = new Map<string, string>();
    get length() { return this._dat.size; };

    clear(): void {
        this._dat.clear();
    }

    getItem(key: string): string | null {
        return this._dat.get(key) || null;
    }

    key(index: number): string | null {
        if (this._dat.size <= index) return null;
        const arr = Array(...this._dat.keys());
        return arr[index];
    }

    removeItem(key: string): void {
        this._dat.delete(key);
    }

    setItem(key: string, value: string): void {
        this._dat.set(key, value);
    }

}

describe('Only local data', () => {
    describe('Only one url', () => {
        test("string set,get", () => {
            const mock_window = {
                localStorage: new MockStorage()
            } as any as Window & typeof globalThis
            const storage = LocalStorage.setup(mock_window, "test").storage
            if (!storage) fail();
            const kv = sampledata.str.map((k, i) => ["" + i, k] as [string, string])
            const setter = (e: [string, string]) => storage.set(e[0], e[1])
            kv.forEach(setter)



        })
    })

    // test('make from mock', _=>{
    //     PathValueMock.mockImplementation(() => {
    //         return {
    //             type: "root",
    //             path: "root",
    //             value: "",
    //         }
    //     });
    //     const val = new PathValue("","","");
    //     expect(val.type).toContain("root");
    //     return;
    // })

    // test('with static method', () => {
    //     const static_f1 = jest.fn()
    //     const static_f2 = jest.fn()
    //     PathValue.open = static_f1
    //     PathValue.arr = static_f2

    //     // mockImplementationOnceで実装したいクラスを設定する
    //     PathValueMock.mockImplementation(() => {
    //         return {
    //             type: "root",
    //             path: "root",
    //             value: "",
    //         }
    //     });

    //     static_f2.mockReturnValue([[], () => new PathValue("1", "2", {})])

    //     const ret_arr = PathValue.arr([]);
    //     ret_arr[0].push(ret_arr[1](["3","4",""]))

    //     static_f1.mockReturnValue({ arr: ret_arr[0], push: ret_arr[1] })

    //     const arr = PathValue.open({});
    //     expect(PathValueMock).toHaveBeenCalled();
    //     const a0 = arr.arr[0];
    //     expect(a0.type).toContain("root");
    //     return;
    // });
});
