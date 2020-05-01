import greet,{greet_all} from "#/functions/greet";
import * as  Greet from "#/functions/greet";

describe('greet', (): void => {
    test('should say hello to Tom.', (): void => {
        const response: string = greet('Tom');
        expect(response).toBe('Hello, Tom!');
    });
})

describe('greetAll', (): void => {
    test('should say hello to [Tom,Ben].', (): void => {
        const response = greet_all(['Tom',"Ben"]);
        expect(response.next().value).toBe('Hello, Tom!');
        expect(response.next().value).toBe('Hello, Ben!');
        expect(response.next().value).toBeUndefined();
    });
})


// with function mock
describe('greet関数のモック化テスト', () => {
    test('モック化できているか', () => {
        // spyOnすることによって、該当関数の型がspyInplementationに変化します。
        // mockReturnValueOnceによって自由にモック化できます。
        // jest.spyOnだけでは、実際の関数（モック化されていない関数）が実行されるので注意
        const greetSpy = jest
            .spyOn(Greet, "greet")
            .mockReturnValueOnce('Hello, Jhon!');

        expect(Greet.greet("Tom")).toBe('Hello, Jhon!');
        expect(greetSpy).toHaveBeenCalled();
    });
});

