class Player{

    id = null;
    state = null;
    is_playing = false;

    constructor(id, state){
        this.id = id;
        this.state = state;
    }

    play(){
        this.is_playing = true;
    }

}