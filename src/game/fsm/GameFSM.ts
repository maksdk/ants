import { World } from 'ecsy';
import { Scene } from '@game/Scene';
import { Game } from '@game/Game';
import { BaseState } from '@fsm/BaseState';
import { PreloadingState } from '@fsm/PreloadingState';
import { AssetsPreloader } from '@libs/AssetsPreloader';
import { ResizeManager } from '@libs/ResizeManager';

export class GameFSM {
    public loader!: AssetsPreloader;
    public scene!: Scene;
    public world!: World;
    public resizeManager!: ResizeManager;
    private currentState!: BaseState;
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public start(): void {
        this.loader = this.game.loader;
        this.scene = this.game.scene;
        this.world = this.game.world;
        this.resizeManager = this.game.resizeManager;
        this.setState(PreloadingState);
    }

    public setState(StateClass: new (fsm: GameFSM) => BaseState): void {
        if (this.currentState) {
            this.currentState.onExit();
        }

        this.currentState = new StateClass(this);

        this.currentState.onPrepare(() => {
            this.currentState.onEnter();
        });
    }
}
