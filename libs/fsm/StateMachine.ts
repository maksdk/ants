import { NullState } from './NullState';
import FSM = Core.FSM;

export class StateMachine<T> implements FSM.IStateMachine {
    target: unknown;
    states: FSM.IState[];
    currentState?: FSM.IState;
    previousState?: FSM.IState;

    constructor(target: T) {
        this.target = target;
        this.states = [];
        this.currentState = undefined;
        this.previousState = undefined;
    }

    public changeStateTo(name: string): void {
        const onExitFinished = (): void => {
            const newState = this.getStateByName(name);
            newState.onEnterState();
            this.swapStates(newState);
        };

        if (this.currentState) {
            this.currentState.onExitState(onExitFinished);
        } else {
            onExitFinished();
        }
    }

    public registerStates(states: FSM.IState | FSM.IState[]): void {
        if (!Array.isArray(states)) {
            states = [states];
        }
        states.forEach((state) => this.states.push(state));
    }

    public getStateByName(name: string): FSM.IState {
        const state = this.states.find((state) => state.name === name);
        if (!state) {
            return new NullState(name, this);
        }
        return state;
    }

    private swapStates(newState: FSM.IState): void {
        this.previousState = this.currentState;
        this.currentState = newState;
        StateMachine.log(this.currentState, this.previousState);
    }

    static log(currState?: FSM.IState, previousState?: FSM.IState): void {
        console.log(
            `%c State was change!
            previous state: ${previousState && previousState.name}
            current state: ${currState && currState.name}`,
            'color: white; background: black; font-size: 15px'
        );
    }
}
