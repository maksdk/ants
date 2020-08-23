export class GameConfig {
    isDevMode: boolean;
    prodUrl: string;
    devUrl: string;
    containerUiId: string;
    gameCanvasId: string;
    containerId: string;
    application: {
        autoDensity: boolean;
        backgroundColor: number;
        width: number;
        height: number;
        view: HTMLCanvasElement | null;
    };

    constructor() {
        this.isDevMode = true;
        this.prodUrl = '';
        this.devUrl = '';
        this.containerUiId = '#game-ui';
        this.gameCanvasId = '#game-canvas';
        this.containerId = '#game-container';
        this.application = {
            autoDensity: true,
            backgroundColor: 0x010D21,
            width: 900,
            height: 900,
            view: null
        };
    }
}
