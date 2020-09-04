import { GridController } from './../GridController';
import { Container, Graphics } from 'pixi.js';
import { BaseState } from '@fsm/BaseState';
import { GameFSM } from '@fsm/GameFSM';
import { AbstractLayer } from '@libs/layer';
import { InputHandler } from '@game/InputHandler';
import { AntSoldierEntity, AntEntity } from '@game/entities';
import { matrix as gridMatrix } from '@config/grid';
import {
    MovingComponent,
    AntComponent,
    SoldierComponent,
    GuardPatrollingComponent,
    GuardFollowingComponent,
    IMovingComponent
} from '@game/components';
import { MovingSystem, GuardPatrollingSystem, GuardFollowingSystem } from '@game/systems';

export class GameplayState extends BaseState {
    private layer!: AbstractLayer;
    private gridController: GridController;

    constructor(fsm: GameFSM) {
        super(fsm);

        this.layer = this.fsm.scene.getLayer('Game');

        this.gridController = new GridController(gridMatrix);
        // @ts-ignore
        window.GridController = this.gridController;

        this.fsm.world.registerComponent(AntComponent);
        this.fsm.world.registerComponent(SoldierComponent);
        this.fsm.world.registerComponent(GuardPatrollingComponent);
        this.fsm.world.registerComponent(GuardFollowingComponent);
        this.fsm.world.registerComponent(MovingComponent);

        this.fsm.world.registerSystem(MovingSystem);
        this.fsm.world.registerSystem(GuardPatrollingSystem);
        this.fsm.world.registerSystem(GuardFollowingSystem);
    }

    public onEnter(): void {
        let cellW = 32;
        let cellH = 32;
        let gameWorldWidth = gridMatrix[0].length * cellW;
        let gameWorldHeight = gridMatrix.length * cellH;
        const scaleGameWorld = Math.min(
            this.fsm.resizeManager.width / gameWorldWidth,
            this.fsm.resizeManager.height / gameWorldHeight
        );
        cellW *= scaleGameWorld;
        cellH *= scaleGameWorld;
        gameWorldWidth *= scaleGameWorld;
        gameWorldHeight *= scaleGameWorld;

        const gameWorld = new Container();
        gameWorld.position.set(gameWorldWidth * -0.5, gameWorldHeight * -0.5);
        this.layer.addChild(gameWorld);

        const board = new Container();
        gameWorld.addChild(board);

        gridMatrix.forEach((row: number[], y0: number) => {
            row.forEach((item: number, x0) => {
                const cell = new Cell(cellW, cellH, item);
                cell.position.set(x0 * cellW, y0 * cellH);
                board.addChild(cell);
            });
        });

        const antEntity = new AntEntity(this.fsm.world, 'AntEntity');
        antEntity.addComponent(AntComponent, { object: antEntity });
        this.layer.addChild(antEntity);

        for (let i = 0; i < 5; i += 1) {
            const soldierEntity = new AntSoldierEntity(this.fsm.world, 'SoldierEntity' + i);
            soldierEntity.addComponent(SoldierComponent, { object: soldierEntity });
            soldierEntity.addComponent(GuardPatrollingComponent);
            this.layer.addChild(soldierEntity);
        }

        const inputHandler = this.layer.addChild(
            new InputHandler(this.fsm.resizeManager.width, this.fsm.resizeManager.height)
        );
        inputHandler.on('input:down', (e: PIXI.InteractionEvent) => {
            if (antEntity.hasComponent(MovingComponent)) {
                const muttableComponent = antEntity.getMutableComponent(MovingComponent) as IMovingComponent;
                muttableComponent.end = e.data.getLocalPosition(this.layer);
                muttableComponent.start = antEntity.position.clone();
                muttableComponent.progress = 0;
            } else {
                antEntity.addComponent(MovingComponent, {
                    end: e.data.getLocalPosition(this.layer),
                    start: antEntity.position.clone()
                });
            }
        });

        inputHandler.on('input:down', (e: PIXI.InteractionEvent) => {
            const pos = e.data.getLocalPosition(board);
            const xIndex = Math.floor(pos.x / cellW);
            const yIndex = Math.floor(pos.y / cellH);
            console.log('x: ', xIndex);
            console.log('y: ', yIndex);
        });
    }
}

class Cell extends Container {
    private back: Graphics;
    private colors: { [key: string]: number } = {
        0: 0xffffff,
        1: 0x666666
    };
    constructor(w: number, h: number, color: number) {
        super();

        this.back = new Graphics();
        this.back.beginFill(this.colors[String(color)]);
        this.back.drawRect(0, 0, w, h);
        this.back.endFill();
        this.addChild(this.back);

        const border = new Graphics();
        border.lineStyle(1, 0x000000);
        border.drawRect(0, 0, w, h);
        border.endFill();
        this.addChild(border);
    }
}
