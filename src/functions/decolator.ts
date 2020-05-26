export function sealed(constructor: Function) {
    Object.freeze(constructor);
    Object.freeze(constructor.prototype);
}

export function enumerable(value: boolean) {
    return function (target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    }
}

export function dec(key: string) {
    console.log("dec(" + key + ") is eval");
    return function (target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor) {
        console.log("dec(" + key + ") is called");
    }
}

export function arg_try(...n:any[]) {
    console.log(arguments);
}

export function arg_try_fuctory(...n:any[]) {
    console.log("F0", arguments);
    const rc = [0]
    const rec =  function () {
        console.log("F"+rc.length, arguments);
        rc.push(rc.length)
        return rec;
    }
    return rec;
}
