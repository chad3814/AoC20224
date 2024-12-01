import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function main() {
    if (process.argv.length < 4) {
        console.error('Need to specify day and problem');
        process.exit(1);
    }
    const day = parseInt(process.argv[2], 10);
    const problem = parseInt(process.argv[3], 10);

    if (Number.isNaN(day) || day < 1 || day > 25) {
        console.error('Only Days 1-25 are valid');
        process.exit(1);
    }

    if (Number.isNaN(problem) || problem < 1 || problem > 2) {
        console.error('Only problems 1-2 are valid');
        process.exit(1);
    }

    try {
        let input: string;
        if (process.argv.length > 4) {
            input = process.argv[4];
        } else {
            input = await readFile(`Day ${day}/input.txt`, 'utf-8');
        }
        try {
            const path = join(__dirname, `Day ${day}/code ${problem}.js`);
            const {default: func} = await import(path);
            await func(input);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    } catch (err) {
        console.error(`No input for day ${day} problem`);
        process.exit(1);
    }
}

main();
