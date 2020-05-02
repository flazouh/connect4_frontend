CALCULATION_TIME = 5;
EXPLORATION_PARAMETER = Math.pow(2, 1 / 2);

class MonteCarloTreeSearch {


    get_best_node(root) {

        let time_spent = 0;
        let delta = 0;
        let last_loop_call_time = Date.now();

        let leaf = null;
        let outcome = null;
        while (this.resources_left(time_spent)) {
            // console.log(root);
            // debugger
            leaf = this.traverse(root);
            outcome = this.simulate(leaf);
            this.backpropagate(leaf, outcome);

            delta = Date.now() - last_loop_call_time;
            time_spent += delta;
            last_loop_call_time = Date.now();
        }
        console.log(root);

        return this.best_child(root)
    }

    resources_left(time_spent) {
        return time_spent < CALCULATION_TIME * 1000;
    }

//  for node traversal
    traverse(node) {
        // console.log("traversing");
        while (!node.is_leaf()) {
            // console.log(node);

            let best_choice = this.best_choice(node.children);
            if (best_choice == null) break;
            node = best_choice;
        }
        if (node.is_terminal()) return node;

        node.expand();
        // console.log(node);
        return this.pick_unvisited_children(node.children)
    }

    simulate(node) {
        // console.log("simulate");
        // console.log(node);
        // debugger

        while (!node.is_terminal()) {
            node = this.simulation_policy(node);
            // console.log(node);
            // console.log(node.is_terminal());

        }
        return node.state.outcome;
    }

    simulation_policy(node) {
        let valid_moves = node.state.get_valid_moves();
        let move = valid_moves[Math.floor(Math.random() * valid_moves.length)];

        let copy = node.state.copy();
        copy.play_move(move);
        return new MonteCarloNode(copy, node);
    }

    backpropagate(node, outcome) {
        // console.log("backpropagate");
        switch (outcome) {
            case Outcome.DRAW:
                node.nb_wins += 0.5;
                break;
            case Outcome.PLAYER1_WON:
                if (node.state.player_to_reach_position === PlayerID.PLAYER1) {
                    node.nb_wins += 1
                }
                break;
            case Outcome.PLAYER2_WON:
                if (node.state.player_to_reach_position === PlayerID.PLAYER2) {
                    node.nb_wins += 1
                }
                break;
        }

        node.nb_simulations += 1;
        if (node.is_root()) return;

        this.backpropagate(node.parent, outcome);
    }

    best_child(node) {
        // debugger
        let max = node.children.reduce(function (prev, current) {
            return (prev.nb_simulations > current.nb_simulations) ? prev : current
        });
        return max
    }

    pick_unvisited_children(children) {
        children = this.shuffle(children);
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.is_leaf) {
                return child
            }
        }
    }

    best_choice(children) {
        // console.log("choosing best choice");
        // console.log(children);
        // console.log(children.map(child => this.get_uct(child)));

        let max = null;
        let max_value = Number.NEGATIVE_INFINITY;
        // debugger
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let uct = this.get_uct(child);
            if (uct > max_value) {
                max_value = uct;
                max = child;
            }
        }

        return max
    }

    shuffle(array) {
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }

    get_uct(node) {
        if (node.nb_simulations == 0) return Number.POSITIVE_INFINITY;
        let term1 = node.nb_wins / node.nb_simulations;
        let term2 = Math.pow(Math.log(node.parent.nb_simulations) / node.nb_simulations, 1 / 2);
        // return term1 + (EXPLORATION_PARAMETER * term2)
        return term1 + EXPLORATION_PARAMETER * term2
    }

}
