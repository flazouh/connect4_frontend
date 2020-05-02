const directions = {
    UP: 0,
    UP_RIGHT: 1,
    RIGHT: 2,
    DOWN_RIGHT: 3,
    DOWN: 4,
    DOWN_LEFT: 5,
    LEFT: 6,
    UP_LEFT: 7,

};

const orientations = {
    bottom_to_top_diagonal: [directions.UP_RIGHT, directions.DOWN_LEFT],
    top_to_bottom_diagonal: [directions.DOWN_RIGHT, directions.UP_LEFT],
    horizontal: [directions.RIGHT, directions.LEFT],
    vertical: [directions.DOWN, directions.UP]
};

function coordinate_in_direction(direction, coordinate) {
    switch (direction) {
        case directions.UP:
            return {x: coordinate.x, y: coordinate.y + 1};
        case directions.UP_RIGHT:
            return {x: coordinate.x + 1, y: coordinate.y + 1};
        case directions.RIGHT:
            return {x: coordinate.x + 1, y: coordinate.y};
        case directions.DOWN_RIGHT:
            return {x: coordinate.x + 1, y: coordinate.y - 1};
        case directions.DOWN:
            return {x: coordinate.x, y: coordinate.y - 1};
        case directions.DOWN_LEFT:
            return {x: coordinate.x - 1, y: coordinate.y - 1};
        case directions.LEFT:
            return {x: coordinate.x - 1, y: coordinate.y};
        case directions.UP_LEFT:
            return {x: coordinate.x - 1, y: coordinate.y + 1};

    }
}