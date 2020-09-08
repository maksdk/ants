import { randomInt } from '@game/helpers';
import { Container, Graphics } from 'pixi.js';
import { BaseState } from '@fsm/BaseState';
import { GameFSM } from '@fsm/GameFSM';
import { AbstractLayer } from '@libs/layer';
import { InputHandler } from '@game/InputHandler';
import { AntSoldierEntity, AntEntity, WorkEntity } from '@game/entities';
import { matrix as gridMatrix } from '@config/grid';
import sample from 'lodash/sample';

import {
    AntComponent,
    PathFindingComponent,
    IAntComponent,
    PathMovingComponent,
    SpawnComponent,
    SoldierComponent,
    GuardingComponent,
    ResourseCollectionComponent,
    ResourseDeliveryComponent,
    ResourseMiningComponent,
    ResourseSavingComponent,
    ResourseSearchingComponent,
    WorkerComponent
} from '@game/components';

import { PathFindingSystem, PathMovingSystem, SpawnSystem, GuardingSystem } from '@game/systems';

import { Vector2 } from 'math-threejs';
import { GridController } from '@game/GridController';
import { ResourseCollectionSystem } from '@game/systems/ResourseCollectionSystem';

let cellW = 32;
let cellH = 32;

export class GameplayState extends BaseState {
    private layer: AbstractLayer;
    private gridController: GridController;

    constructor(fsm: GameFSM) {
        super(fsm);

        this.layer = this.fsm.scene.getLayer('Game');

        this.fsm.world.registerComponent(SpawnComponent);
        this.fsm.world.registerComponent(AntComponent);
        this.fsm.world.registerComponent(WorkerComponent);
        this.fsm.world.registerComponent(SoldierComponent);
        this.fsm.world.registerComponent(PathFindingComponent);
        this.fsm.world.registerComponent(PathMovingComponent);
        this.fsm.world.registerComponent(GuardingComponent);
        this.fsm.world.registerComponent(ResourseCollectionComponent);
        this.fsm.world.registerComponent(ResourseDeliveryComponent);
        this.fsm.world.registerComponent(ResourseMiningComponent);
        this.fsm.world.registerComponent(ResourseSavingComponent);
        this.fsm.world.registerComponent(ResourseSearchingComponent);
    }

    public onEnter(): void {
        let gameWorldWidth = gridMatrix[0].length * cellW;
        let gameWorldHeight = gridMatrix.length * cellH;
        const scaleGameWorld = Math.min(
            (this.fsm.resizeManager.width * 0.95) / gameWorldWidth,
            (this.fsm.resizeManager.height * 0.95) / gameWorldHeight
        );
        cellW *= scaleGameWorld;
        cellH *= scaleGameWorld;
        gameWorldWidth *= scaleGameWorld;
        gameWorldHeight *= scaleGameWorld;

        this.gridController = new GridController(gridMatrix, cellW, cellH);

        this.fsm.world.registerSystem(SpawnSystem);
        this.fsm.world.registerSystem(GuardingSystem, {
            gridController: this.gridController
        });
        this.fsm.world.registerSystem(PathFindingSystem, {
            gridController: this.gridController
        });
        this.fsm.world.registerSystem(ResourseCollectionSystem, {
            gridController: this.gridController
        });
        this.fsm.world.registerSystem(PathMovingSystem);

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
        antEntity.addComponent(SpawnComponent, {
            parent: gameWorld,
            // @ts-ignore
            position: this.gridController.toCoord({ x: 48, y: 6 })
        });

        const freeAroundAntCells = this.gridController.getFreeDeepNeighbors(48, 6, 5);
        for (let i = 0; i < 1; i += 1) {
            const randomCell = sample(freeAroundAntCells) as { x: number; y: number };
            const soldierEntity = new AntSoldierEntity(this.fsm.world, 'SoldierEntity' + i);
            soldierEntity.addComponent(SpawnComponent, {
                parent: gameWorld,
                // @ts-ignore
                position: this.gridController.toCoord(randomCell)
            });
            soldierEntity.addComponent(SoldierComponent, { object: soldierEntity });
            soldierEntity.addComponent(GuardingComponent, {
                area: freeAroundAntCells
            });
        }

        const soursePointIndex = { x: 20, y: 21 };
        const storagePointIndex = { x: 38, y: 23 };
        const sourseCoord = this.gridController.toCoord(soursePointIndex) as { x: number; y: number };
        const soursePoint = new Vector2(sourseCoord.x, sourseCoord.y);
        const storageCoord = this.gridController.toCoord(storagePointIndex) as { x: number; y: number };
        const storagePoint = new Vector2(storageCoord.x, storageCoord.y);

        for (let i = 0; i < 10; i += 1) {
            const worker = new WorkEntity(this.fsm.world, 'Worker ' + i);
            worker.addComponent(WorkerComponent, { object: worker });
            worker.addComponent(SpawnComponent, {
                parent: gameWorld,
                // @ts-ignore
                position: this.gridController.toCoord({ x: randomInt(5, 23), y: randomInt(2, 25) })
            });
            worker.addComponent(ResourseCollectionComponent, {
                soursePointIndex,
                storagePointIndex,
                soursePoint,
                storagePoint
            });
            worker.addComponent(ResourseSearchingComponent);
        }

        const inputHandler = this.layer.addChild(
            new InputHandler(this.fsm.resizeManager.width, this.fsm.resizeManager.height)
        );
        inputHandler.on('input:down', (e: PIXI.InteractionEvent) => {
            const antComponent = antEntity.getComponent(AntComponent) as IAntComponent;
            const startPos = antComponent.object.position.clone();
            const endPos = e.data.getLocalPosition(unmutableLayer);
            antEntity.addComponent(PathFindingComponent, {
                start: new Vector2(startPos.x, startPos.y),
                end: new Vector2(endPos.x, endPos.y)
            });

            console.log('Index: ', this.gridController.fromCoordToIndex(endPos.x, endPos.y));
        });

        const unmutableLayer = new Container();
        unmutableLayer.width = gameWorldWidth;
        unmutableLayer.height = gameWorldHeight;
        gameWorld.addChild(unmutableLayer);
        //ff00002b
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
