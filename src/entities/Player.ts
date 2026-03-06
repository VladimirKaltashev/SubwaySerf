class Player {
    constructor(name, score = 0) {
        this.name = name;
        this.score = score;
    }

    increaseScore(amount) {
        this.score += amount;
    }

    getScore() {
        return this.score;
    }
}

export default Player;