import { Model } from './Model';
import { Scene } from './Scene';
import { Ticker } from './Ticker';

export class Game {
    private app: PIXI.Application;
    public model: Model;
    public ticker: Ticker;
    public scene: Scene;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.model = new Model();
        this.ticker = new Ticker(app);
        this.scene = new Scene({ name: 'MainScene', zIndex: 0, config: {} });

        this.app.stage.addChild(this.scene);
        this.ticker.add('Game', this.update.bind(this));
    }

    update(): void {
        /*do nothing here for now*/
    }

    onResize(): void {
        /*do nothing here for now*/
    }
}
