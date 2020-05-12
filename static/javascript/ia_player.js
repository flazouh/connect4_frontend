AI_URL = 'https://sleepy-tundra-33813.herokuapp.com/getmove/'

class IAPlayer extends Player {
    monte_carlo = null;

    // tree = null;

    constructor(id, state) {
        super(id, state);
        this.monte_carlo = new MonteCarloTreeSearch()
    }

    notify_turn() {
        super.notify_turn();
        // let copy = this.state.copy();
        // // debugger
        // let root = new MonteCarloNode(copy, null);
        //
        //
        // let node = this.monte_carlo.get_best_node(root);
        //
        // let move = node.state.move_played_to_reach_position;
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
        data = JSON.stringify(data)
        console.log(data);
        postData(AI_URL, data)
            .then(move => {
                console.log(move);
                place_disc(move.col, move.row)
            });


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

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
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
    });
    return response.json(); // parses JSON response into native JavaScript objects
}