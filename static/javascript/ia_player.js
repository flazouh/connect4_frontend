class IAPlayer extends Player {
    monte_carlo = null;
    // tree = null;

    constructor(id, state) {
        super(id, state);
        this.monte_carlo = new MonteCarloTreeSearch()
    }

    notify_turn() {
        super.notify_turn();
        let copy = this.state.copy();
        // debugger
        let root = new MonteCarloNode(copy, null);
        // if (root.state.move_played_to_reach_position != null){
        //     if (this.tree !== null){
        //         let past_result = this.search_past_result(root);
        //         if (past_result !== null){
        //             // debugger
        //             // console.log("found past result");
        //             // console.log(past_result);
        //             root = past_result
        //         }
        //     }
        //
        // }

        let node = this.monte_carlo.get_best_node(root);
        // this.tree = node;
        let move = node.state.move_played_to_reach_position;
        place_disc(move.col, move.row);
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