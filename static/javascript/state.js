const ROWS = 6;
const COLS = 7;

class State {
    grid
    current_player = 0
    previous_player = 0
    move
    winner
    winnner_discs
    nb_moves = 0;
    outcome = Outcome.NONE


    constructor() {
        this.grid = new Array(COLS).fill(null).map(() => new Array(ROWS).fill(PlayerID.NO_PLAYER));
    }

    set_player(move, player_id) {
        this.grid[move.col][move.row] = player_id;
    }

    get_player_from_disc(col, row) {
        return this.grid[col][row]
    }

    get_potential_cell_row(col) {
        let row = 0;
        if (this.grid[col][row] !== PlayerID.NO_PLAYER) return;

        while (row < ROWS && this.grid[col][row] === PlayerID.NO_PLAYER) {
            row++;
        }
        return row - 1
    }

    copy() {
        let copy = new State();
        copy.current_player = this.current_player;
        copy.previous_player = this.previous_player;
        copy.move = this.move;
        copy.nb_moves = this.nb_moves;
        copy.outcome = this.outcome;

        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                let player_id = this.get_player_from_disc(col, row);
                if (player_id === null) continue;

                copy.set_player({col: col, row: row}, player_id)
            }
        }
        return copy
    }

    play_move(move) {
        console.log(this.constructor.name, 'play_move()')
        this.move = move;
        this.nb_moves += 1;
        this.set_player(move, this.current_player);
        if (this.nb_moves === COLS * ROWS) {
            this.outcome = Outcome.DRAW
        }
        let discs = this.has_connected_four(move.col, move.row);
        if (discs) {
            this.game_won(discs)
        }
        this.change_turn();
        return this.outcome
    }

    game_won(discs) {
        console.log(`${this.current_player} has won!`);
        this.winner = this.current_player;
        this.winnner_discs = discs;
        this.outcome = this.current_player === PlayerID.PLAYER1 ? Outcome.PLAYER1_WON : Outcome.PLAYER2_WON
    }

    has_connected_four(x, y) {
        let player = this.grid[x][y];
        let c = {x: x, y: y};
        let orientations_lists = {
            bottom_to_top_diagonal: [c],
            top_to_bottom_diagonal: [c],
            horizontal: [c],
            vertical: [c]
        };

        for (let orientation in orientations) {
            let direction_list = orientations[orientation];

            for (const direction of direction_list) {
                let coordinate = coordinate_in_direction(direction, c);
                let count = 1;
                while (this.valid_coordinate(coordinate)) {
                    if (this.grid[coordinate.x][coordinate.y] !== player) break;
                    orientations_lists[orientation].push(coordinate);
                    coordinate = coordinate_in_direction(direction, coordinate);
                    count++;

                }
            }
        }
        for (let orientation in orientations_lists) {
            let orientation_list = orientations_lists[orientation];
            if (orientation_list.length >= 4) return orientation_list;
        }
    }

    change_turn() {
        console.log(this.constructor.name, 'change_turn()')
        this.previous_player = this.current_player;
        switch (this.current_player) {
            case PlayerID.PLAYER1:
                this.current_player = PlayerID.PLAYER2;
                break
            case PlayerID.PLAYER2:
                this.current_player = PlayerID.PLAYER1;
                break
        }

    }


    valid_coordinate(coordinate) {
        if (coordinate.x < 0 || coordinate.x > COLS - 1) return false;
        if (coordinate.y < 0 || coordinate.y > ROWS - 1) return false;
        return true;
    }

}