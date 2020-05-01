import { PathValue } from "#littler/classes/PathValue"

// jest.mock()によってクラス全体をモック化できます
jest.mock('#littler/classes/PathValue'); // パスを指定

// TypeScriptでは型変換する必要がある
const PathValueMock = PathValue as any as jest.Mock;

describe('Class (PathValue) mock test', () => {
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

    test('with static method', () => {
        const static_f1 = jest.fn()
        const static_f2 = jest.fn()
        PathValue.open = static_f1
        PathValue.arr = static_f2

        // mockImplementationOnceで実装したいクラスを設定する
        PathValueMock.mockImplementation(() => {
            return {
                type: "root",
                path: "root",
                value: "",
            }
        });

        static_f2.mockReturnValue([[], () => new PathValue("1", "2", {})])

        const ret_arr = PathValue.arr([]);
        ret_arr[0].push(ret_arr[1](["3","4",""]))

        static_f1.mockReturnValue({ arr: ret_arr[0], push: ret_arr[1] })

        const arr = PathValue.open({});
        expect(PathValueMock).toHaveBeenCalled();
        const a0 = arr.arr[0];
        expect(a0.type).toContain("root");
        return;
    });
});
