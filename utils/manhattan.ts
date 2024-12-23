import { memoize } from "./memoize";
import { Point } from "./point";

export function* manhattanPoints(
    distance: number,
    centerPoint: Point,
    maxX: number, maxY: number,
    minX = 0, minY = 0
): Generator<Point> {
    for (let y = 0; y < distance * 2; y++) {
        const deltaY = y - distance;
        for (let x = 0; x < distance * 2; x++) {
            const deltaX = x - distance;
            const dist = Math.abs(deltaX) + Math.abs(deltaY);
            if (dist > distance) {
                continue;
            }
            const point = Point.p(centerPoint.x + deltaX, centerPoint.y + deltaY);
            if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
                continue;
            }

            yield point;
        }
    }
}

export const manhattanDistance = (a: Point, b: Point): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
