import { NotImplemented, run } from "aoc-copilot";
import { DefaultMap } from "../utils/default-map";

type AdditionalInfo = {
    [key: string]: string;
};

function isAnagram(a: string, b: string): boolean {
    const mapA = new DefaultMap<string, number>(0);
    const mapB = new DefaultMap<string, number>(0);
    for (const c of a.split('')) {
        mapA.set(c, mapA.get(c) + 1);
    }
    for (const c of b.split('')) {
        mapB.set(c, mapB.get(c) + 1);
    }
    return [...mapA.keys()].every(
        c => mapB.get(c) === mapA.get(c)
    ) && [...mapB.keys()].every(
        c => mapA.get(c) === mapB.get(c)
    );
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    if (part === 1) {
        let correctCount = 0;
        for (const phrase of input) {
            const words = phrase.split(' ');
            const set = new Set<string>();
            let valid = true;
            for (const word of words) {
                if (set.has(word)) {
                    valid = false;
                    break;
                }
                set.add(word);
            }
            if (valid) {
                correctCount++;
            }
        }
        return correctCount;
    }
    let correctCount = 0;
    for (const phrase of input) {
        const words = phrase.split(' ');
        let valid = true;
        for (let i = 0; i < words.length; i++) {
            for (let j = i + 1; j < words.length; j++) {
                if (isAnagram(words[i], words[j])) {
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                break;
            }
        }
        if (valid) {
            correctCount++
        }
    }
    return correctCount;
}

run(__filename, solve);
