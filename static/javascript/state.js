class State {
    grid = null;
    current_player_id = 0;
    player_to_reach_position = 0;
    move_played_to_reach_position = null;
    players = {};
    winner = null;
    winnner_discs = null;
    nb_moves = 0;
    outcome = Outcome.NONE;


    constructor() {
        this.grid = new Array(COLS).fill(null).map(() => new Array(ROWS).fill(PlayerID.NO_PLAYER));
    }

    get_valid_moves() {
        let valid_moves = [];
        for (let col = 0; col < COLS; col++) {
            let row = this.get_potential_cell_row(col);
            if (row == null) continue;
            valid_moves.push({col: col, row: row})
        }
        return valid_moves
    }

    set_cell_state(move, player_id) {
        this.grid[move.col][move.row] = player_id;
    }

    get_cell_state(col, row) {
        return this.grid[col][row]
    }

    get_player_from_id(id) {
        return this.players[id]
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
        copy.current_player_id = this.current_player_id;
        copy.player_to_reach_position = this.player_to_reach_position;
        copy.move_played_to_reach_position = this.move_played_to_reach_position;
        copy.players = this.players;
        copy.nb_moves = this.nb_moves;
        copy.outcome = this.outcome;

        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                let player_id = this.get_cell_state(col, row);
                if (player_id === null) continue;

                copy.set_cell_state({col: col, row: row}, player_id)
            }
        }
        return copy
    }

    play_move(move) {
        this.move_played_to_reach_position = move;
        this.nb_moves += 1;
        this.set_cell_state(move, this.current_player_id);
        let discs = this.has_connected_four(move.col, move.row);
        if (discs) {
            this.game_won(discs)
        } else if (this.nb_moves === COLS * ROWS) {
            this.outcome = Outcome.DRAW
        }
        this.change_turn();
    }

    game_won(discs) {
        // console.log(`${this.current_player_id} has won!`);
        this.winner = this.current_player_id;
        this.winnner_discs = discs;
        this.outcome = this.current_player_id === PlayerID.PLAYER1 ? Outcome.PLAYER1_WON : Outcome.PLAYER2_WON
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
        console.log("chaging turn")
        // debugger
        this.get_player_from_id(this.current_player_id).is_playing = false;
        this.player_to_reach_position = this.current_player_id;
        switch (this.current_player_id) {
            case PlayerID.PLAYER1:
                this.current_player_id = PlayerID.PLAYER2;
                break
            case PlayerID.PLAYER2:
                this.current_player_id = PlayerID.PLAYER1;
                break
        }
        console.log(this.current_player_id, "is playing after turn change")
        this.get_player_from_id(this.current_player_id).play()

    }


    valid_coordinate(coordinate) {
        if (coordinate.x < 0 || coordinate.x > COLS - 1) return false;
        if (coordinate.y < 0 || coordinate.y > ROWS - 1) return false;
        return true;
    }

}