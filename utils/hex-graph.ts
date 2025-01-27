import { Graph } from "./graph2";
import { Point, PointLike } from "./point";

export enum HexDirection {
    NORTH = 0,
    NORTH_EAST = 1,
    SOUTH_EAST = 2,
    SOUTH = 3,
    SOUTH_WEST = 4,
    NORTH_WEST = 5,
};

/*

  \ n  /
nw +--+ ne
  /    \
-+      +-
  \    /
sw +--+ se
  / s  \

           +---+
   \ 1,0  /     \ 3,0 /
0,1 +----+  2,1  +---+
   /      \     /     \
 -+   1,2  +---+  3,2  +-
   \      /     \     /
0,3 +----+  2,3  +---+
   / 1,4  \     / 3,4 \

   vertically and horizontally cells change by 2, on the diagonals change by 1
  */

export class HexPoint extends Point {
    public override adjacentPoints(maxX: number, maxY: number, minX = 0, minY = 0, includeDiagonals = false): PointLike[] {
        const points: PointLike[] = [
            HexPoint.p(this.x - 1, this.y - 1),
            HexPoint.p(this.x, this.y - 2),
            HexPoint.p(this.x + 1, this.y - 1),
            HexPoint.p(this.x + 1, this.y + 1),
            HexPoint.p(this.x, this.y + 2),
            HexPoint.p(this.x - 1, this.y + 1),
        ].filter(
            p => p.x >= minX &&
                 p.x <= maxX &&
                 p.y >= minY &&
                 p.y <= maxY
        );

        return points;
    }
}

const HexP = (x: number, y: number) => HexPoint.p(x, y);
export function emptyHexGraph(rows: number, cols: number) {
    const field: string[] = [];
    for (let y = 0; y < rows; y++) {
        const s = (y + 1) % 2;
        const line = '.#'.repeat(cols - s);
        if (s === 1) {
            field.push('#' + line);
        } else {
            field.push(line);
        }
    }
    return new Graph(field, HexP);
}