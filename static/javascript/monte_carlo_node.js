class MonteCarloNode {
    win_rate = null;
    nb_simulations = 0;
    nb_wins = 0;

    state = null;
    children = [];
    parent = null;



    constructor(state, parent) {
        this.state = state;
        this.parent = parent
    }

    expand() {
        // debugger
        // console.log("expanding");
        let valid_moves = this.state.get_valid_moves();
        //we already found all the moves for this node
        if (this.children.length === valid_moves.length) return;
        valid_moves.forEach(move => {
            let copy = this.state.copy();
            copy.play_move(move);

            let child = new MonteCarloNode(copy, this);
            this.children.push(child)
        })
    }

    is_leaf() {
        return this.nb_simulations === 0;
    }

    is_root() {
        return this.parent == null;
    }

    is_terminal() {
        return this.state.outcome !== null;
    }

}