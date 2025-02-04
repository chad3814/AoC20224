export enum Direction {
    NORTH = 0,
    UP = 0,
    EAST = 1,
    RIGHT = 1,
    SOUTH = 2,
    DOWN = 2,
    WEST = 3,
    LEFT = 3,
};

export enum Turn {
    LEFT = 0,
    RIGHT = 1,
    STRAIGHT = 2,
    UTURN = 3,
};

export const OppositeDirection = {
    [Direction.NORTH]: Direction.SOUTH,
    [Direction.EAST]: Direction.WEST,
    [Direction.SOUTH]: Direction.NORTH,
    [Direction.WEST]: Direction.EAST,
};

type NorthOffset = {
    [Direction.NORTH]: [0, -1];
};
type EastOffset = {
    [Direction.EAST]: [1, 0];
};
type SouthOffset = {
    [Direction.SOUTH]: [0, 1];
};
type WestOffset = {
    [Direction.WEST]: [-1, 0];
};

export const DirectionOffset: NorthOffset&EastOffset&SouthOffset&WestOffset = {
    [Direction.NORTH]: [0, -1],
    [Direction.EAST]: [1, 0],
    [Direction.SOUTH]: [0, 1],
    [Direction.WEST]: [-1, 0],
};


export function dForward(direction: Direction): 'north'|'east'|'south'|'west' {
    if (direction === Direction.NORTH) return 'north';
    if (direction === Direction.EAST) return 'east';
    if (direction === Direction.SOUTH) return 'south';
    return 'west';
}

export function dBackward(direction: Direction): 'north'|'east'|'south'|'west' {
    if (direction === Direction.NORTH) return 'south';
    if (direction === Direction.EAST) return 'west';
    if (direction === Direction.SOUTH) return 'north';
    return 'east';
}

export function dLeft(direction: Direction): 'north'|'east'|'south'|'west' {
    if (direction === Direction.NORTH) return 'west';
    if (direction === Direction.EAST) return 'north';
    if (direction === Direction.SOUTH) return 'east';
    return 'south';
}

export function dRight(direction: Direction): 'north'|'east'|'south'|'west' {
    if (direction === Direction.NORTH) return 'east';
    if (direction === Direction.EAST) return 'south';
    if (direction === Direction.SOUTH) return 'west';
    return 'north';
}

export function turnLeft(direction: Direction): Direction {
    if (direction === Direction.NORTH) return Direction.WEST;
    if (direction === Direction.EAST) return Direction.NORTH;
    if (direction === Direction.SOUTH) return Direction.EAST;
    return Direction.SOUTH;
}

export function turnRight(direction: Direction): Direction {
    if (direction === Direction.NORTH) return Direction.EAST;
    if (direction === Direction.EAST) return Direction.SOUTH;
    if (direction === Direction.SOUTH) return Direction.WEST;
    return Direction.NORTH;
}

export function uTurn(direction: Direction): Direction {
    if (direction === Direction.NORTH) return Direction.SOUTH;
    if (direction === Direction.EAST) return Direction.WEST;
    if (direction === Direction.SOUTH) return Direction.NORTH;
    return Direction.EAST;
}

export function dIndex(direction: Direction): 0|1|2|3 {
    if (direction === Direction.NORTH) return 0;
    if (direction === Direction.EAST) return 1;
    if (direction === Direction.SOUTH) return 2;
    return 3;
}
