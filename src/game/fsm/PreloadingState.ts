import { Text } from 'pixi.js';
import { AbstractLayer } from '@libs/layer';
import { BaseState } from '@fsm/BaseState';
import { GameplayState } from '@fsm/GameplayState';

export class PreloadingState extends BaseState {
    private layer!: AbstractLayer;
    public onEnter(): void {
        this.layer = this.fsm.scene.getLayer('UI');
        const title = new Text('Loading ...', {
            fontSize: 80,
            fill: 0xffffff,
            fontFamily: 'Coneria'
        });
        title.name = 'PreloadingTitle';
        title.anchor.set(0.5);
        this.layer.addChild(title);

        this.fsm.loader.load(() => {
            this.fsm.setState(GameplayState);
        });
    }

    public onExit(): void {
        const title = this.layer.getChildByName('PreloadingTitle');
        this.layer.removeChild(title);
    }
}
