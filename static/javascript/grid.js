class Grid {

    matrix = null;
    current_player = null;

    constructor() {
        this.matrix = new Array(COLS).fill(null).map(() => new Array(ROWS).fill(player.EMPTY));
    }


}