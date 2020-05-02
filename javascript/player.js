class Player{

    id = null;
    state = null;
    is_playing = false;

    constructor(id, state){
        this.id = id;
        this.state = state;
    }

    notify_turn(){
        this.is_playing = true;
    }
}