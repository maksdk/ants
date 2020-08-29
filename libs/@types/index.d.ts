declare module Core {
    export namespace FSM {
        export interface IStateMachine {
            target: { [key: string]: any };
            states: IState[];
            currentState?: IState;
            previousState?: IState;

            changeStateTo: (name: string) => void;
            registerStates: (states: IState[]) => void;
            getStateByName: (name: string) => IState;
        }

        export interface IState {
            name: string;
            fsm: IStateMachine;
            onEnterState: () => void;
            onExitState: (onFinish: () => void) => void;
        }
    }

    export namespace Layer {
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

        export interface IDraggable extends IData {
            viewPortSizes: { width: number; height: number };
        }

        export interface IDraggableLayer extends ILayer {
            activate: () => void;
            deactivate: () => void;
        }
    }

    export namespace Parser {
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

    export namespace Builder {
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
            modifiers?: IModifiers;
        }

        export interface ISpriteConfig {
            name: string;
            textureName: string;
            modifiers?: IModifiers;
        }

        export interface ITextConfig {
            name: string;
            text?: string;
            style?: PIXI.TextStyle | object;
            modifiers?: IModifiers;
        }

        export interface ITreeConfig {
            name: string;
            type: Types;
            textureName?: string;
            text?: string;
            style?: PIXI.TextStyle | object;
            modifiers?: IModifiers;
            children?: ITreeConfig[]
        }
    }

    export namespace Data {
        export interface IResize {
            game: {
                width: number;
                height: number;
            };
            viewport: {
                width: number;
                height: number;
            }
            isPortrait: boolean;
        }
        export type TickHook = (dt: number, totalTime: number) => void;
        export type ResizeHook = (sizes: IResize) => void;
    }
}








