SAVE_GAME_URL = 'https://connect4-vs-ai-backend.herokuapp.com/savegame'

// SAVE_GAME_URL = 'http://localhost:8080/savegame'

class Game {
    game_type
    state
    players = {}
    ai_first = false
    history = []
    started_at
    duration

    constructor(game_type) {
        console.log("New", game_type)
        this.game_type = game_type
        this.state = new State();

        switch (this.game_type) {
            case GameType.HUMAN_VS_HUMAN:
                this.players[PlayerID.PLAYER1] = new HumanPlayer(PlayerID.PLAYER1, this.state);
                this.players[PlayerID.PLAYER2] = new HumanPlayer(PlayerID.PLAYER2, this.state);
                break;
            case GameType.HUMAN_VS_IA:
                if (this.ai_first) {
                    this.players[PlayerID.PLAYER1] = new IAPlayer(PlayerID.PLAYER1, this.state);
                    this.players[PlayerID.PLAYER2] = new HumanPlayer(PlayerID.PLAYER2, this.state);
                } else {
                    this.players[PlayerID.PLAYER1] = new HumanPlayer(PlayerID.PLAYER1, this.state);
                    this.players[PlayerID.PLAYER2] = new IAPlayer(PlayerID.PLAYER2, this.state);
                }

                break;
            case GameType.IA_VS_IA:
                this.players[PlayerID.PLAYER1] = new IAPlayer(PlayerID.PLAYER1, this.state);
                this.players[PlayerID.PLAYER2] = new IAPlayer(PlayerID.PLAYER2, this.state);
                break;

        }
        this.state.current_player = PlayerID.PLAYER1;
        this.started_at = Date.now()
    }

    get_player_from_id(id) {
        return this.players[id]
    }

    play_move(move) {
        this.history.push(move)
        console.log(this.constructor.name, 'play_move()')
        this.state.play_move(move)
        this.get_player_from_id(this.state.previous_player).is_playing = false;

        if (this.state.outcome !== Outcome.NONE) {
            this.post_game()
            return
        }
        this.get_player_from_id(this.state.current_player).play()
    }

    get_local_player() {
        if (this.game_type === GameType.IA_VS_IA) return
        if (this.game_type === GameType.HUMAN_VS_HUMAN) return this.state.current_player
        if (this.game_type === GameType.HUMAN_VS_IA)
            return (this.ai_first ? PlayerID.PLAYER2 : PlayerID.PLAYER1)

    }

    post_game() {
        let ended_at = Math.round(Date.now() / 1000)
        let started_at = Math.round(this.started_at / 1000)
        let data = {
            moves: this.history,
            outcome: this.state.outcome,
            started_at: started_at,
            ended_at: ended_at,
            duration: ended_at - started_at
        }
        console.log(data)
        post_request(SAVE_GAME_URL, data).then(r => {})
    }
}