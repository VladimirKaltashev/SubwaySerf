class Game {
    constructor() {
        this.score = 0;
    }

    start() {
        console.log('Game has started!');
    }

    updateScore(points) {
        this.score += points;
    }

    getScore() {
        return this.score;
    }
}

export default Game;