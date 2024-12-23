import { NotImplemented, run } from "aoc-copilot";
import { memoize } from "../utils/memoize";

type AdditionalInfo = {
    [key: string]: string;
};

const findGroups = memoize<void, [Map<string, Set<string>>, string[]], string[]>(3)((connections: Map<string, Set<string>>, orderedComputers: string[]): string[] => {
    const computer = orderedComputers[0];
    const set = connections.get(computer);
    if (!set) {
        throw new Error('computer does not have a set');
    }
    const setOrdered = [...set.values()].sort().filter(
        comp => comp.localeCompare(computer) > 0
    )
    if (setOrdered.length === 0) {
        return [computer];
    }
    if (setOrdered.length === 1) {
        return [`${computer},${setOrdered[0]}`];
    }
    const groups: string[] = [];
    for (let i = 0; i < setOrdered.length; i++) {
        const otherComputer = setOrdered[i];
        const set2 = connections.get(otherComputer);
        if (!set2) {
            throw new Error('computer does not have a set');
        }
        if (!set2.has(computer)) continue;
        const subgroups = findGroups(connections, setOrdered.slice(i));
        for (const group of subgroups) {
            if (group.split(',').every(c => set.has(c))) {
                groups.push(group);
            }
        }
    }
    return groups.map(s => s.length === 0 ? computer : `${computer},${s}`);
});

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const connections = new Map<string, Set<string>>();
    for (const line of input) {
        const [a, b] = line.split('-');
        const set = connections.get(a) ?? new Set<string>();
        set.add(b);
        connections.set(a, set);
        const set2 = connections.get(b) ?? new Set<string>();
        set2.add(a);
        connections.set(b, set2);
    }
    if (part === 1) {
        const triples = new Set<string>();
        for (const [comp, set] of connections.entries()) {
            if (!comp.startsWith('t')) {
                continue;
            }
            if (set.size < 2) {
                continue;
            }
            for (const connection of set.keys()) {
                const set2 = connections.get(connection)!;
                for (const connection2 of set2.keys()) {
                    if (set.has(connection2)) {
                        console.log(comp, connection, connection2);
                        triples.add([comp, connection, connection2].sort().join('-'));
                    }
                }
            }
        }
        return triples.size;
    }
    const sorted = [...connections.keys()].sort();
    let groups: string[] = [];
    for (let i = 0; i < sorted.length; i++) {
        groups = groups.concat(findGroups(connections, sorted.slice(i)));
    }

    groups.sort(
        (a, b) => b.length - a.length
    );
    return groups[0];
}

run(__filename, solve);
