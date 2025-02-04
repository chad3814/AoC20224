import { NotImplemented, Options, run } from "aoc-copilot";
import { Egdb } from "aoc-copilot/dist/examples";

type AdditionalInfo = {
    [key: string]: string;
};

function unescapeStr(str: string): string {
    let s = '';
    if (str[0] !== '"' || str.at(-1) !== '"') {
        throw new Error('invalid string');
    }
    for (let i = 1; i < str.length - 1; i++) {
        if (str[i] !== '\\') {
            s += str[i];
            continue;
        }
        i++;
        if (str[i] === '\\' || str[i] === '"') {
            s += str[i];
            continue;
        }
        if (str[i] !== 'x') {
            throw new Error('invalid escape: ' + str + '@' + i + ' ' + str[i-1] + str[i] + '; ' + s);
        }
        i++;
        const x = parseInt(str.substring(i, i + 2), 16);
        i++;
        s += String.fromCharCode(x);
    }

    return s;
}

function escapeStr(str: string): string {
    let s = '';
    for (const c of str) {
        if (c === '\\' || c === '"') {
            s += '\\';
        }
        s += c;
    }
    return `"${s}"`;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let code = 0;
    let memory = 0;
    let encoded = 0;
    for (const line of input) {
        code += line.length;
        memory += unescapeStr(line).length;
        console.log(line, escapeStr(line));
        encoded += escapeStr(line).length;
    }
    if (part === 1) {
        return code - memory;
    }
    return encoded - code;
}

const options: Options = {};
const args: string[] = process.argv.splice(2);
for (const arg of args) {
    if (arg === '-t') options.testsOnly = true;
    if (arg === '-s') options.skipTests = true;
    if (arg === '1') options.onlyPart = 1;
    if (arg === '2') options.onlyPart = 2;
}

const egdb: Egdb = {
    "reason": "Irregular",
    "part1length": 1,
    "inputs": {
        "selector": "code",
        "indexes": [[0, 2, 5, 8], [18, 22, 26, 30]],
    },
    "answers": {
        "selector": 'code',
        "indexesOrLiterals": [16, 36],
        "transforms": [{
            "functions": [
                { "match": [".* = (\d+)"] },
                { "at": [1] }
            ],
            "appliesTo": [0, 1],
        }]
    }
};

run(__filename, solve, options, egdb);
