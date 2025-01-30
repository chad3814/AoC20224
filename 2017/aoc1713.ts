import { logger, NotImplemented, run } from "aoc-copilot";
import { match } from "assert";

type AdditionalInfo = {
    [key: string]: string;
};

type Layer = {
    id: number;
    depth: number;
    scannerPosition: number;
    headingDown: boolean;
};

const RE = /(?<id>\d+): (?<depth>\d+)/u;

function updateScanner(layer: Layer): void {
    let pos = layer.scannerPosition;
    if (layer.headingDown) {
        pos++;
    } else {
        pos--;
    }
    if (pos < 0) {
        layer.scannerPosition = 1;
        layer.headingDown = true;
    } else if (pos >= layer.depth) {
        layer.scannerPosition = layer.depth - 2;
        layer.headingDown = false;
    } else {
        layer.scannerPosition = pos;
    }
}

function resetScanner(layer: Layer): void {
    layer.headingDown = true;
    layer.scannerPosition = 0;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const layers = new Map<number, Layer>();
    for (const line of input) {
        const matches = line.match(RE);
        if (!matches || !matches.groups) {
            throw new Error('re');
        }
        const id = Number(matches.groups.id);
        const depth = Number(matches.groups.depth);
        layers.set(id, {
            id,
            depth,
            scannerPosition: 0,
            headingDown: true,
        });
    }
    const lastLayer = Math.max(...layers.keys());
    // logger.log('lastLayer', lastLayer);
    // logger.log([...layers.keys()]);
    if (part === 1) {
        let total = 0;
        for (let layer = 0; layer <= lastLayer; layer++) {
            const security = layers.get(layer);
            logger.log('security:', security?.id, security?.scannerPosition);
            if (security && security.scannerPosition === 0) {
                total += layer * security.depth;
            }
            for (const l of layers.values()) {
                updateScanner(l);
                logger.log(`scanner ${l.id}, ${l.scannerPosition}/${l.depth}, ${l.headingDown}`);
            }
            logger.log();
        }
        return total;
    }
    const packetLayers: number[] = [];
    while (true) {
        packetLayers.push(-1);
        for (let i = 0; i <packetLayers.length; i++) {
            packetLayers[i]++;
            if (packetLayers[i] < 0) {
                packetLayers[i] = -2;
                continue;
            }
            const security = layers.get(packetLayers[i]);
            if (security && security.scannerPosition === 0) {
                packetLayers[i] = -2;
                continue;
            }
            if (packetLayers[i] === lastLayer) {
                return i;
            }
        }
        for (const l of layers.values()) {
            updateScanner(l);
        }
    }
}

run(__filename, solve);
