import { AssetsPreloader } from '../libs/AssetsPreloader';
import { Application } from 'pixi.js';
import assets from '../assets';

import { GameConfig } from './configs/GameConfig';
import { Game } from './game/Game';
const gameConfig = new GameConfig();
const { application, gameCanvasId } = gameConfig;

application.view = document.body.querySelector(gameCanvasId) as HTMLCanvasElement;
const app: PIXI.Application = new Application(application);
const game: Game = new Game(app);

const onAssetsLoaded = () => {
    game.run();
    game.resizeManager.resize();
};

const onAssetsLoadProgress = (percentProgress: number) => {
    console.log('Progress: ', percentProgress);
};

const assetsPreloader = new AssetsPreloader(app, assets);
assetsPreloader.load(onAssetsLoaded, onAssetsLoadProgress);
