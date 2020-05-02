class MonteCarloNode {
    state = null;
    move = null;

    children = [];
    parent = null;

    nb_simulations = 0;
    nb_wins = 0;

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
            // child.move = move;
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