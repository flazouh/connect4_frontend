const CELL_WIDTH = 60;
const CELL_DIAMETER = 47.5;

const GRID_WIDTH = CELL_WIDTH * COLS;
const GRID_HEIGHT = CELL_WIDTH * ROWS;
const GRID_BORDER_RADIUS = 15;
const ANIMATION_TIME = 0.5;

let discs = [];

let game;
let animation_playing = false;

// let game_type = GameType.HUMAN_VS_IA;
// let game_type = GameType.HUMAN_VS_HUMAN;
let game_type = GameType.IA_VS_IA;


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
    game = new Game(game_type)

    setTimeout(() => {
        game.get_player_from_id(game.state.current_player).play();
    }, 1000)

}

function get_column_from_mouse() {
    console.log("get_column_from_mouse")
    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            cell = discs[i][j];
            distance = Math.sqrt(Math.pow(mouseX - cell.x, 2) + Math.pow(mouseY - cell.y, 2));
            if (distance <= CELL_DIAMETER / 2) {
                console.log("column", i, "was pressed")
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


function on_disc_animation_complete(coordinates) {
    console.log("on_disc_animation_complete()");
    animation_playing = false;
    game.play_move(coordinates);

    if (game.state.outcome === Outcome.NONE) return
    if (game.state.winner === null) return

    win_animation(game.state.winnner_discs);
}


function place_disc(col, row) {
    console.log("place_disc()")
    let target_disc = discs[col][row];
    let coordinate = pixels_to_coordinate(target_disc.x, target_disc.y);
    start_coordinate = {
        x: target_disc.x,
        y: 0
    };
    start_disc_animation(start_coordinate, target_disc, coordinate);
}

function start_disc_animation(start_coordinate, end_coordinate, position) {
    console.log('start_disc_animation()');
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
    console.log("state.current_player", game.state.current_player)
    console.log("is_playing", game.get_player_from_id(game.state.current_player).is_playing)
    if (game.state.outcome !== Outcome.NONE) return;
    if (!game.get_player_from_id(game.get_local_player()).is_playing) return;
    if (animation_playing) return;

    let col = get_column_from_mouse();
    if (col == null) return;

    let row = game.state.get_potential_cell_row(col);
    if (row == null) return;
    place_disc(col, row)

}


function render_disc_animation(animation_coordinate) {
    // console.log("render_disc_animation");
    // console.log(animation_coordinate);
    let c = get_color_for_player(game.state.current_player);
    fill(c);
    ellipse(animation_coordinate.x, animation_coordinate.y, CELL_DIAMETER)

}

function draw() {
    render_background();
    render_cells(game.state);
}

function render_background() {
    // draw blue background
    fill(Colors.BLUE);
    rect(0, 0, GRID_WIDTH, GRID_HEIGHT, GRID_BORDER_RADIUS);
}

function get_color_for_player(player) {
    switch (player) {
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
            let disc = discs[col][row];
            noStroke();
            fill(get_color_for_player(game.state.get_player_from_disc(col, row)));
            ellipse(disc.x, disc.y, disc.diameter);
            fill(0);
            text(disc.number, disc.x, disc.y)
            // line(disc.x - 10, disc.y, 20, disc.y);
        }
    }
}
