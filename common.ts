import { createInterface } from 'node:readline/promises';
import { Readable } from 'node:stream';

export function getLines(input: string) {
    const s = Readable.from(input);
    const rl = createInterface(s);
    return rl;
}