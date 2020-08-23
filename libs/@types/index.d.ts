declare namespace FSM {
    export interface IStateMachine {
        target: { [key: string]: any };
        states: IState[];
        currentState?: IState;
        previousState?: IState;

        changeStateTo: (name: string) => void;
        registerStates: (states: FSM.IState[]) => void;
        getStateByName: (name: string) => FSM.IState;
    }

    export interface IState {
        name: string;
        fsm: IStateMachine;
        onEnterState: () => void;
        onExitState: (onFinish: Function) => void;
    }
}

declare namespace Layer {
    export interface IData {
        name: string;
        zIndex: number;
        config: { [key: string]: any };
    }

    export interface ILayer {
        name: string;
        zIndex: number;
        config: { [key: string]: any };
    }

    export interface IDraggable extends Layer.IData {
        viewPortSizes: { width: number; height: number };
    }

    export interface IDraggableLayer extends ILayer {
        activate: () => void;
        deactivate: () => void;
    }
}

declare namespace Parser {
    export interface IParserRules {
        [key: string]: RegExp;
    }

    export interface IParserInput {
        [key: string]: PIXI.LoaderResource;
    }

    export interface IParserResult {
        [key: string]: PIXI.Texture;
    }

    export interface IResourcesParser {
        rules: IParserRules;
        parseResources: (resources: IParserInput) => IParserResult;
    }
}

declare namespace Builder {
    export type Types = "Container" | "Sprite" | "Text";
    export type Methods = "createContainer" | "createSprite" | "createText";

    export interface IDictionaryMethods {
        "Container": "createContainer";
        "Sprite": "createSprite";
        "Text": "createText";
    }

    export type Modifier = Object | string | number;

    export interface IModifiers {
        [key: string]: Modifier;
    }

    export interface IContainerConfig {
        name: string;
        type: "Container";
        modifiers?: IModifiers;
    }

    export interface ISpriteConfig {
        name: string;
        type: "Sprite";
        textureName: string;
        modifiers?: IModifiers;
    }

    export interface ITextConfig {
        name: string;
        type: "Text";
        text?: string;
        style?: PIXI.TextStyle | object;
        modifiers?: IModifiers;
    }

    // TODO think about ITreeConfig
    export interface ITreeConfig extends IContainerConfig {
        children?: Array<ITextConfig | IContainerConfig | ISpriteConfig>;
    }
}
