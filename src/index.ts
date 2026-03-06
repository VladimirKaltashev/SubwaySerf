// index.ts - Точка входа для Subway Surfers clone

import Game from './Game';

// Создание и запуск игры
let game: Game;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Subway Surfers is loading...');
    
    // Создаем игру с canvas элементом
    game = new Game('gameCanvas');
    
    // Инициализация игры (показывает меню)
    game.init();
    
    console.log('Subway Surfers is ready! Press SPACE to start.');
});

// Экспорт для возможного использования в других модулях
export { game };
export default Game;
