import { Model } from './Model';
import { Scene } from './Scene';
import { Ticker } from '../../libs/Ticker';
import { ResizeManager } from '../../libs/ResizeManager';
import { UIBuilder } from '../../libs/UIBuilder';

export class Game {
    private app: PIXI.Application;
    public model: Model;
    public ticker: Ticker;
    public scene: Scene;
    public resizeManager: ResizeManager;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.model = new Model();
        this.ticker = new Ticker(app);
        this.scene = new Scene({ name: 'MainScene', zIndex: 0, config: {} });
        this.resizeManager = new ResizeManager(app, { width: 900, height: 900 });

        this.app.stage.addChild(this.scene);
        this.ticker.add('Game', this.update.bind(this));
        this.resizeManager.add('Game', this.onResize.bind(this));
    }

    run(): void {
        const ui = this.scene.getLayer('UI');

        const kenny = UIBuilder.createSprite({
            name: 'kenny',
            type: 'Sprite',
            textureName: 'kenny',
            modifiers: {
                anchor: { x: 0.5, y: 0.5 },
                scale: { x: 0.5, y: 0.5 }
            }
        });

        const title = UIBuilder.createText({
            name: 'title',
            text: 'They killed kenny!!!',
            type: 'Text',
            style: {
                fontSize: 80,
                fill: 0xffffff,
                fontFamily: 'Coneria',
                padding: 30
            }
        });

        ui.addChild(kenny, title);
    }

    update(): void {
        /*do nothing here for now*/
    }

    onResize(sizes: Data.IResize): void {
        /*do nothing here for now*/
        const { game } = sizes;
        this.scene.position.set(game.width / 2, game.height / 2);

        const title = this.scene.getLayer('UI').getChildByName('title');
        title.position.set(-game.width / 2, -game.height / 2);
    }
}
