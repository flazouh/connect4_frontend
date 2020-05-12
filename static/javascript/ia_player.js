AI_URL = 'https://sleepy-tundra-33813.herokuapp.com/getmove'
// AI_URL = 'http://localhost:5001/getmove'

class IAPlayer extends Player {
    monte_carlo = null;

    // tree = null;

    constructor(id, state) {
        super(id, state);
        this.monte_carlo = new MonteCarloTreeSearch()
    }

    async play() {
        super.play()
        let move = this.state.move_played_to_reach_position
        if (move === null) {
            move = {col: 0, row: 0}
        }
        let data = {
            grid: this.state.grid,
            outcome: this.state.outcome,
            currentplayer: this.state.current_player_id,
            previousplayer: this.state.player_to_reach_position,
            move: move,
            nbmoves: this.state.nb_moves
        }
        console.log(data);
        await postData(AI_URL, data)
            .then(data => {
                move = data.move
                console.log(move)
                place_disc(move.col, move.row)
            });
        console.log("ai done")
    }

    same_move(node1, node2) {
        let move1 = node1.state.move_played_to_reach_position;
        let move2 = node2.state.move_played_to_reach_position;
        return move1.col === move2.col && move1.row === move2.row
    }

    search_past_result(root) {

        let current_node = this.tree;
        while (!this.same_move(current_node, root)) {
            for (let i = 0; i < current_node.children.length; i++) {
                let child = current_node.children[i];
                if (this.same_move(child, root)) {
                    return child;
                }
            }
        }
        return null
    }

}


function postData(url, data) {
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
        .then(response => response.json())
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            console.log(error);
        });
}