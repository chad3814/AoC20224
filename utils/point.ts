export class Point {
    public static p(x: number, y: number) {
        let p = this.points.get(`${x}-${y}`);
        if (p) return p;
        p = new Point(x, y);
        this.points.set(`${x}-${y}`, p);
        return p;
    }

    public adjacentPoints(maxX: number, maxY: number, minX = 0, minY = 0, includeDiagonals = false): Point[] {
        const points: Point[] = [];
        if (this.x > minX) {
            points.push(Point.p(this.x - 1, this.y));
            if (includeDiagonals) {
                if (this.y > minY) {
                    points.push(Point.p(this.x - 1, this.y - 1));
                }
                if (this.y < maxY) {
                    points.push(Point.p(this.x - 1, this.y + 1));
                }
            }
        }
        if (this.x < maxX) {
            points.push(Point.p(this.x + 1, this.y));
            if (includeDiagonals) {
                if (this.y > minY) {
                    points.push(Point.p(this.x + 1, this.y - 1));
                }
                if (this.y < maxY) {
                    points.push(Point.p(this.x + 1, this.y + 1));
                }
            }
        }
        if (this.y > minY) {
            points.push(Point.p(this.x, this.y - 1));
        }
        if (this.y < maxY) {
            points.push(Point.p(this.x, this.y + 1));
        }

        return points;
    }

    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }

    private constructor(public readonly x: number, public readonly y: number) {}
    private static points: Map<string, Point> = new Map<string, Point>();
}

export type Path = Point[];
