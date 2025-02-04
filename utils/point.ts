export interface PointLike {
    x: number;
    y: number;
    adjacentPoints: (maxX: number, maxY: number, minX?: number, minY?: number, includeDiagonals?: boolean) => PointLike[];
    toString: () => string;
};

export class Point implements PointLike {
    public static p(pos: [number, number]): PointLike;
    public static p(x: number, y: number): PointLike;
    public static p(xOrPos: number|[number, number], y?: number): PointLike {
        let x: number;
        if (Array.isArray(xOrPos)) {
            x = xOrPos[0];
            y = xOrPos[1];
        } else {
            if (y == null) {
                throw new Error('Invalid signature');
            }
            x = xOrPos as number;
        }
        let p = this.points.get(`${x}-${y}`);
        if (p) return p;
        p = new this(x, y);
        this.points.set(`${x}-${y}`, p);
        return p;
    }

    public adjacentPoints(maxX: number, maxY: number, minX = 0, minY = 0, includeDiagonals = false): PointLike[] {
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

    protected constructor(public readonly x: number, public readonly y: number) {}
    protected static points: Map<string, PointLike> = new Map<string, PointLike>();
}

export type Path = PointLike[];
