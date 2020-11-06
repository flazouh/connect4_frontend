AI_URL = 'https://connect4-vs-ai-backend.herokuapp.com/getmove'
// AI_URL = 'http://localhost:8080/getmove'

class IAPlayer extends Player {

    constructor(id, state) {
        super(id, state);
    }

    async play() {
        console.log(this.constructor.name, 'play()')
        super.play()
        let move = this.state.move
        if (move === null) {
            move = {col: 0, row: 0}
        }
        let data = {
            grid: this.state.grid,
            outcome: this.state.outcome,
            currentplayer: this.state.current_player,
            previousplayer: this.state.previous_player,
            move: move,
            nbmoves: this.state.nb_moves
        }

        await post_request(AI_URL, data)
            .then(data => {
                move = data.move
                console.log(move)
                place_disc(move.col, move.row)
            });
        console.log(this.constructor.name, 'play() done')

    }
}
