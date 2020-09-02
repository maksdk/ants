import { Application } from 'pixi.js';
import { GameConfig } from '@config/GameConfig';
import { Game } from '@game/Game';

const gameConfig = new GameConfig();
const { application, gameCanvasId } = gameConfig;

application.view = document.body.querySelector(gameCanvasId) as HTMLCanvasElement;

const app = new Application(application);
const game = new Game(app);
game.start();
