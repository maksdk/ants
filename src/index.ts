import { AssetsPreloader } from '../libs/AssetsPreloader';
import { Application, Sprite, Text } from 'pixi.js';
import assets from '../assets';

import { GameConfig } from './configs/GameConfig';
const gameConfig = new GameConfig();
const { application, gameCanvasId } = gameConfig;

application.view = document.body.querySelector(gameCanvasId) as HTMLCanvasElement;
const app: PIXI.Application = new Application(application);

const onAssetsLoaded = () => {
    const sprite = Sprite.from('kenny');
    app.stage.addChild(sprite);

    const title = new Text('They killed kenny!!!', { fontSize: 50, fill: 0xffffff, fontFamily: 'Coneria' });
    app.stage.addChild(title);
};

const onAssetsLoadProgress = (percentProgress: number) => {
    console.log('Progress: ', percentProgress);
};

const assetsPreloader = new AssetsPreloader(app, assets);
assetsPreloader.load(onAssetsLoaded, onAssetsLoadProgress);
