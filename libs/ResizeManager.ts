export class ResizeManager {
    private app: PIXI.Application;
    private baseSize: { width: number; height: number };
    private list: { [name: string]: Data.ResizeHook };

    constructor(app: PIXI.Application, baseSize: { width: number; height: number }) {
        this.app = app;
        this.baseSize = baseSize;
        this.list = {};

        this.resize = this.resize.bind(this);

        window.addEventListener('resize', this.resize);
    }

    has(name: string): boolean {
        return !!this.list[name];
    }

    add(name: string, onResize: Data.ResizeHook): void {
        if (this.has(name)) {
            throw new Error(`ResizeManager: You are a little bastard, you can not add '${name}' twice!`);
        }
        this.list[name] = onResize;
    }

    remove(name: string): void {
        if (!this.has(name)) {
            throw new Error(`ResizeManager: You are a little bastard, the '${name}' does not exist in Ticker list!`);
        }
        delete this.list[name];
    }

    resize(): void {
        const { innerHeight, innerWidth } = window;
        const { width, height } = this.baseSize;

        const isPortrait = innerHeight > innerWidth;
        const viewport = { width: innerWidth, height: innerHeight };
        const game = { width: 0, height: 0 };

        if (isPortrait) {
            game.width = width | 0;
            game.height = (height * (innerHeight / innerWidth)) | 0;
        } else {
            game.height = height | 0;
            game.width = (width * (innerWidth / innerHeight)) | 0;
        }

        this.app.renderer.resize(game.width, game.height);
        this.app.view.style.width = `${viewport.width}px`;
        this.app.view.style.height = `${viewport.height}px`;

        Object.values(this.list).forEach((onResize) =>
            onResize({
                game,
                viewport,
                isPortrait
            })
        );
    }
}
