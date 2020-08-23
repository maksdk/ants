export abstract class AbstractState implements FSM.IState {
    name: string;
    fsm: FSM.IStateMachine;

    constructor(name: string, fsm: FSM.IStateMachine) {
        this.name = name;
        this.fsm = fsm;
    }

    abstract onEnterState(): void;

    abstract onExitState(onFinish: Function): void;

    goToNextState(stateName: string) {
        this.fsm.changeStateTo(stateName);
    }
}