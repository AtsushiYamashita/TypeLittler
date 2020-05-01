import * as fs from "fs"
import * as path from "path"

console.log(`\n<< Executing >> makeup...`)
const logger = function (...args: any[]) {
    console.log(...args);
    return undefined;
}

const name = Array(...process.argv).pop() as string

const files = [
    path.resolve(__dirname,  "src", name + ".ts"),
    path.resolve(__dirname,  "tests", name + ".tests.ts"),
]

files.forEach(e => logger("File create >>", e) || fs.writeFileSync(e, "\n"))

console.log(" << Done");
process.exit(0);
// console.log("test 2", process.argv)
