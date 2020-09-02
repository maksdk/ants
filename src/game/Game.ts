import TWEEN from '@tweenjs/tween.js';
import { World } from 'ecsy';
import { Model } from '@game/Model';
import { Scene } from '@game/Scene';
import { Ticker } from '@libs/Ticker';
import { ResizeManager } from '@libs/ResizeManager';
import { AssetsPreloader } from '@libs/AssetsPreloader';
import { GameFSM } from '@fsm/GameFSM';
import assets from '@assets';

import Data = Core.Data;

export class Game {
    public model: Model;
    public loader: AssetsPreloader;
    public ticker: Ticker;
    public scene: Scene;
    public resizeManager: ResizeManager;
    public fsm: GameFSM;
    public world: World;
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.model = new Model();
        this.ticker = new Ticker(this.app);
        this.scene = new Scene({ name: 'RootScene', zIndex: 0, config: {} });
        this.resizeManager = new ResizeManager(this.app, { width: 900, height: 900 });
        this.loader = new AssetsPreloader(this.app, assets);
        this.world = new World();
        this.fsm = new GameFSM(this);
    }

    public start(): void {
        this.app.stage.addChild(this.scene);
        this.ticker.add('Game', this.update.bind(this));
        this.resizeManager.add('Game', this.onResize.bind(this));
        this.resizeManager.resize();
        this.fsm.start();
    }

    private update(dt: number, totalTime: number): void {
        TWEEN.update(totalTime);
        this.world.execute(dt);
    }

    private onResize(sizes: Data.IResize): void {
        const { game } = sizes;
        this.scene.position.set(game.width / 2, game.height / 2);
    }
}
