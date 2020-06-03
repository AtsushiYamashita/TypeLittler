import { try_handle } from "#/functions/try_handle";

import md5 = require("blueimp-md5");

// blueimp/JavaScript-MD5: JavaScript MD5 implementation. Compatible with server-side environments like node.js, module loaders like RequireJS and all web browsers.
// : https://github.com/blueimp/JavaScript-MD5
// import * as md5 from "blueimp-md5";


export const to_md5 = <K = string | number, V = string | number | undefined>(key: K, value?: V) => {
    const k = "" + key;
    const v = typeof value === "undefined" ? "undefined" : "" + value;
    return md5(v.trim(), k.trim()).toUpperCase();
}

export const is_usable_big = try_handle(_ => (!!BigInt), 200502.151548, 0)[0].length < 1;

export const big_hash = function (
    data: string,
    start: bigint,
    shift = 5
): bigint {
    const fixed = data || "FAIL";
    let hash: bigint = BigInt(start),
        i = 0,
        chr: bigint = BigInt(0),
        shf: bigint = BigInt(1 << shift),
        zero = BigInt(0);
    if (fixed.length === 0) return hash;
    for (; i < fixed.length; i++) {
        chr = BigInt(fixed.charCodeAt(i));
        hash = (hash * shf - hash) + chr;
        hash |= zero;
    }
    return hash;
};

export const little_hash = function (
    data: string,
    start: number,
    shift = 5): number {
    const fixed = data || "FAIL";
    let hash = (start),
        i = 0,
        chr = (0);
    if (fixed.length === 0) return hash;
    for (; i < fixed.length; i++) {
        chr = fixed.charCodeAt(i);
        hash = ((hash << shift) - hash) + chr;
        hash |= 0;
    }
    return hash;
};

export const hashx = function (
    data: string,
    start = 0,
    shift = 5,
): string {
    const short = () => little_hash(data, start, shift).toString(16);
    return short();

    // Should not use with unsupported environment
    // const big = () => big_hash(data, BigInt(start), shift).toString(16)
    // return is_usable_big ? big() : short();
}

export default hashx
