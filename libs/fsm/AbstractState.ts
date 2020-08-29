import FSM = Core.FSM;

export abstract class AbstractState implements FSM.IState {
    public name: string;
    public fsm: FSM.IStateMachine;

    constructor(name: string, fsm: FSM.IStateMachine) {
        this.name = name;
        this.fsm = fsm;
    }

    abstract onEnterState(): void;

    abstract onExitState(onFinish: () => void): void;

    public goToNextState(stateName: string) {
        this.fsm.changeStateTo(stateName);
    }
}
