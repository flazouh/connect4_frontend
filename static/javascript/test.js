EXPLORATION_PARAMETER = Math.pow(2, 1 / 2);

function get_uct(node) {
    if (node.nb_simulations == 0) return Number.POSITIVE_INFINITY;
    let term1 = node.nb_wins / node.nb_simulations;
    console.log(term1);
    var log = Math.log(node.parent.nb_simulations)
    console.log(log);
    var division = log/node.nb_simulations
    console.log(division);
    var power = Math.pow(division, 1 / 2)
    console.log(power);

    var term2 = power
    console.log(term2);
    // return term1 + (EXPLORATION_PARAMETER * term2)
    return term1 + EXPLORATION_PARAMETER * term2
}

console.log(get_uct({nb_simulations: 279740, parent:{nb_simulations: 672313},nb_wins: 187591.5}));
