const CELL_WIDTH = 60;
const CELL_DIAMETER = 47.5;

const GRID_WIDTH = CELL_WIDTH * COLS;
const GRID_HEIGHT = CELL_WIDTH * ROWS;
const GRID_BORDER_RADIUS = 15;
const ANIMATION_TIME = 0.5;

let discs = [];

let state;
let local_player_id;
let animation_playing = false;
let change_turn_in_next_draw = false;
let game_type = GameType.HUMAN_VS_IA;
// let game_type = GameType.HUMAN_VS_HUMAN;
// let game_type = GameType.IA_VS_IA;



function initialize_cells() {
    for (let col = 0; col < COLS; col++) {
        col_array = [];
        for (let row = 0; row < ROWS; row++) {
            col_array[row] = {
                x: col * CELL_WIDTH + CELL_WIDTH / 2,
                y: row * CELL_WIDTH + CELL_WIDTH / 2,
                diameter: CELL_DIAMETER,
                number: '',
            }
        }
        discs[col] = col_array;
    }
}

function setup() {

    createCanvas(GRID_WIDTH, GRID_HEIGHT);
    initialize_cells();
    frameRate(144);
    // textFont(font);
    textSize(CELL_DIAMETER * 0.7);
    textAlign(CENTER, CENTER);

    state = new State();
    switch (game_type) {
        case GameType.HUMAN_VS_HUMAN:
            state.players[PlayerID.PLAYER1] = new HumanPlayer(PlayerID.PLAYER1, state);
            state.players[PlayerID.PLAYER2] = new HumanPlayer(PlayerID.PLAYER2, state);
            break;
        case GameType.HUMAN_VS_IA:
            state.players[PlayerID.PLAYER1] = new HumanPlayer(PlayerID.PLAYER1, state);
            state.players[PlayerID.PLAYER2] = new IAPlayer(PlayerID.PLAYER2, state);
            break;
        case GameType.IA_VS_IA:
            state.players[PlayerID.PLAYER1] = new IAPlayer(PlayerID.PLAYER1, state);
            state.players[PlayerID.PLAYER2] = new IAPlayer(PlayerID.PLAYER2, state);
            break;

    }
    state.current_player_id = PlayerID.PLAYER1;
    local_player_id = state.current_player_id;
    setTimeout(() => {
        state.get_player_from_id(state.current_player_id).notify_turn();
    }, 1000)

}

function get_column_from_mouse() {
    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            cell = discs[i][j];
            distance = Math.sqrt(Math.pow(mouseX - cell.x, 2) + Math.pow(mouseY - cell.y, 2));
            if (distance <= CELL_DIAMETER / 2) {
                return i
            }
        }
    }
    return null;
}

function pixels_to_coordinate(mouseX, mouseY) {
    return {col: Math.floor(mouseX / CELL_WIDTH), row: Math.floor(mouseY / CELL_WIDTH)}
}

function print_mouse_coordinate() {
    console.log('[x: ' + mouseX + ', y: ' + mouseY + ']');
}


function on_disc_animation_complete(position) {
    // console.log("complete");
    animation_playing = false;
    state.play_move(position);

    if (state.outcome !== null) {
        if (state.winner !== null) {
            win_animation(state.winnner_discs);
        }
        return
    }
    change_turn_in_next_draw = true;


}


function place_disc(col, row) {
    let target_disc = discs[col][row];
    let coordinate = pixels_to_coordinate(target_disc.x, target_disc.y);
    start_coordinate = {
        x: target_disc.x,
        y: 0
    };
    start_disc_animation(start_coordinate, target_disc, coordinate);
}

function start_disc_animation(start_coordinate, end_coordinate, position) {
    // debugger
    // console.log('start_disc_animation');
    gsap.to(start_coordinate, {
        x: end_coordinate.x,
        y: end_coordinate.y,
        duration: ANIMATION_TIME,
        ease: "bounce.out",
        onComplete: on_disc_animation_complete,
        onUpdate: render_disc_animation,
        onCompleteParams: [position],
        onUpdateParams: [start_coordinate],
    });
    animation_playing = true;
}

function win_animation(disc_coordinates) {
    // console.log('win_animation');

    let target_discs = [];
    disc_coordinates.forEach(coordinate => {
        disc = discs[coordinate.x][coordinate.y];
        target_discs.push(disc)
    });

    count = 1;
    delay = 0;
    // debugger
    target_discs = target_discs.sort((a, b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0));
    target_discs.forEach(disc => {
        gsap.to(disc, {
            number: count,
            delay: delay,
            duration: 0
        });
        delay += 0.075;
        count++;

    })

}

function mousePressed() {
    // debugger
    if (state.outcome !== null) return;
    if (!state.get_player_from_id(local_player_id).is_playing) return;
    if (animation_playing) return;

    let col = get_column_from_mouse();
    if (col == null) return;

    let row = state.get_potential_cell_row(col);
    if (row == null) return;
    place_disc(col, row)

}


function render_disc_animation(animation_coordinate) {

    // console.log("render_disc_animation");
    // console.log(animation_coordinate);
    let c = get_color_for_player(state.current_player_id);
    fill(c);

    ellipse(animation_coordinate.x, animation_coordinate.y, CELL_DIAMETER)

}

function draw() {
    // console.log("draw");
    render_background();
    render_cells(state);
    if (change_turn_in_next_draw) {
        state.get_player_from_id(state.current_player_id).notify_turn();
        local_player_id = state.current_player_id;
        change_turn_in_next_draw = false
    }
}

function render_background() {
    // draw blue background
    fill(Colors.BLUE);
    rect(0, 0, GRID_WIDTH, GRID_HEIGHT, GRID_BORDER_RADIUS);
}

function get_color_for_player(grid_element) {
    switch (grid_element) {
        case PlayerID.PLAYER1:
            return Colors.YELLOW;
        case PlayerID.PLAYER2:
            return Colors.RED;
        default:
            return Colors.WHITE;
    }
}

function render_cells(state) {

    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
            disc = discs[col][row];
            noStroke();
            fill(get_color_for_player(state.get_cell_state(col, row)));
            ellipse(disc.x, disc.y, disc.diameter);
            fill(0);
            text(disc.number, disc.x, disc.y)
            // line(disc.x - 10, disc.y, 20, disc.y);
        }
    }
}
