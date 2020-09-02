import { BaseState } from '@fsm/BaseState';
import { GameFSM } from '@fsm/GameFSM';
import { AbstractLayer } from '@libs/layer';
import { InputHandler } from '@game/InputHandler';
import { AntSoldierEntity, AntEntity } from '@game/entities';
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

    constructor(fsm: GameFSM) {
        super(fsm);
        this.layer = this.fsm.scene.getLayer('Game');
    }

    public onEnter(): void {
        this.fsm.world.registerComponent(AntComponent);
        this.fsm.world.registerComponent(SoldierComponent);
        this.fsm.world.registerComponent(GuardPatrollingComponent);
        this.fsm.world.registerComponent(GuardFollowingComponent);
        this.fsm.world.registerComponent(MovingComponent);

        this.fsm.world.registerSystem(MovingSystem);
        this.fsm.world.registerSystem(GuardPatrollingSystem);
        this.fsm.world.registerSystem(GuardFollowingSystem);

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
    }
}
