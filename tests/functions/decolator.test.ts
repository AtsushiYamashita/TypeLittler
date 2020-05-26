import {
    sealed, enumerable,
    // arg_try,
    // arg_try_fuctory,
    // dec,

} from "#/functions/decolator"

@sealed
class SealedClass {
    constructor(
        private _greet_to: string) { }
    greet() {
        return "Hello " + this._greet_to + "!";
    }
}

test('sealed', () => {
    const sealed = new SealedClass("Jhon")
    expect(sealed.greet()).toBe("Hello Jhon!");
    const err: string[] = [];
    try {
        sealed.greet = () => { return "Cannot update"; }
    } catch (e) {
        err.push(e)
    }
    expect(err).toHaveLength(1);
});


//@arg_try
class DecolateMethods {
    //@arg_try
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        //        console.log("DecolateMethods")
        this._x = x;
        this._y = y;
    }

    // @arg_try
    // @dec("x")
    @enumerable(true)
    get x() {
        //console.log("DecolateMethods.x")
        return this._x;
    }

    @enumerable(false)
    get y() { return this._y; }

    // @dec("print")
    public print() {
        console.log("DecolateMethods.print")
    }
}


test('accesser', () => {
    const target = new DecolateMethods(1, 2)
    expect(target.x).toBe(1);
    expect(target.y).toBe(2);
    const keys = Object.keys(Object.getPrototypeOf(target));
    expect(keys).toHaveLength(1);
    expect(keys).toContain("x");
    //target.print();
});

// @arg_try
// interface IDecolated{}

