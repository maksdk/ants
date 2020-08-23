import { AbstractState } from "./AbstractState";

export class NullState extends AbstractState {
    constructor(name: string, fsm: FSM.IStateMachine) {
        super(name, fsm);
    }

    onEnterState(): void {
        throw new Error(`${this.name} state was not fund, NullState was used`);
    }
    onExitState(onFinish: Function): void {
        throw new Error("Method not implemented.");
    }
}