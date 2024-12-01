import { getLines } from "../common";

export default async function func(input: string) {
    let total = 0;
    const listA: number[] = [];
    const listB: number[] = [];
    for await (const line of getLines(input)) {
        const [a, b] = line.split(/\s+/);
        listA.push(parseInt(a));
        listB.push(parseInt(b));
    }
    for (let i = 0; i < listA.length; i++) {
        const same = listB.filter(
            b => b===listA[i]
        );
        total += listA[i] * same.length;
    }
    console.log(total);
}
