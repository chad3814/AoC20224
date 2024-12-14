import { NotImplemented, run } from "aoc-copilot";
import { inspect } from "util";

type AdditionalInfo = {
    [key: string]: string;
};

type File = {
    name: string;
    size: number;
};

type Directory = {
    name: string;
    parent: Directory | null;
    directories: {
        [name: string]: Directory;
    }
    files: {
        [name: string]: File;
    }
    totalSize: number;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const root: Directory = {
        name: '/',
        parent: null,
        directories: {},
        files: {},
        totalSize: 0,
    };
    let cwd = root;
    let lineNum = 0;
    function cd(where: string) {
        if (where === '/') {
            cwd = root;
        } else if (where === '..') {
            if (!cwd.parent) {
                throw new Error('cd to no parent');
            }
            cwd = cwd.parent;
        } else {
            if (!Object.hasOwn(cwd.directories, where)) {
                throw new Error('bad cd');
            }
            cwd = cwd.directories[where];
        }
        lineNum++;
    }
    function ls() {
        lineNum++;
        while(lineNum < input.length && input[lineNum][0] !== '$') {
            if (input[lineNum].startsWith('dir')) {
                const name = input[lineNum].substring(4);
                cwd.directories[name] = {
                    name,
                    parent: cwd,
                    directories: {},
                    files: {},
                    totalSize: 0,
                };
            } else {
                const [sizeStr, name] = input[lineNum].split(' ');
                const size = parseInt(sizeStr, 10);
                cwd.files[name] = {
                    name,
                    size
                };
                let dir: Directory | null = cwd;
                while (dir) {
                    dir.totalSize += size;
                    dir = dir.parent
                }
            }
            lineNum++;
        }
    }
    while (lineNum < input.length) {
        if (input[lineNum][0] !== '$') {
            throw new Error('bad parsing');
        }
        if (input[lineNum].startsWith('$ cd')) {
            cd(input[lineNum].substring(5));
        } else if (input[lineNum] === '$ ls') {
            ls();
        } else {
            throw new Error('unknown command ' + input[lineNum]);
        }
    }

    // console.log(inspect(root, false, null, true));

    if (part === 1) {
        let total = 0;
        const queue: Directory[] = [root];
        while (queue.length > 0) {
            const dir = queue.shift()!;
            if (dir.totalSize <= 100000) {
                total += dir.totalSize;
            }
            queue.push(...Object.values(dir.directories));
        }
        return total;
    }
    const totalSpace = 70000000;
    const spaceNeeded = 30000000;
    const spaceUsed = root.totalSize;
    const spaceToFind = spaceNeeded - (totalSpace - spaceUsed);
    const directories = new Set<Directory>();
    const queue: Directory[] = [root];
    while (queue.length > 0) {
        const dir = queue.shift()!;
        directories.add(dir);
        queue.push(...Object.values(dir.directories));
    }
    const directoriesToConsider = [...directories].filter(
        dir => dir.totalSize >= spaceToFind
    );
    directoriesToConsider.sort(
        (a, b) => a.totalSize - b.totalSize
    );
    return directoriesToConsider[0].totalSize;
}

run(__filename, solve);
