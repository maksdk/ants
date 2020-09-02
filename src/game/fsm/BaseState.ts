/* eslint no-empty-function: 0 */

import { GameFSM } from '@fsm/GameFSM';

export class BaseState {
    protected fsm: GameFSM;

    constructor(fsm: GameFSM) {
        this.fsm = fsm;
    }

    public onPrepare(cb: () => void): void {
        cb();
    }

    public onEnter(): void {
        // do nothing
    }

    public onExit(): void {
        // do nothing
    }
}
