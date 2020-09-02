import Data = Core.Data;

export class Ticker {
    private app: PIXI.Application;
    private list: Map<string, Data.TickHook>;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.list = new Map();

        this.onTick = this.onTick.bind(this);

        this.app.ticker.add(this.onTick.bind(this));
    }

    public has(name: string): boolean {
        return this.list.has(name);
    }

    public add(name: string, onTick: Data.TickHook): void {
        if (this.list.has(name)) {
            throw new Error(`Ticker: You are a little bastard, you can not add '${name}' twice!`);
        }
        this.list.set(name, onTick);
    }

    public remove(name: string): void {
        if (!this.list.has(name)) {
            throw new Error(`Ticker: You are a little bastard, the '${name}' does not exist in Ticker list!`);
        }
        this.list.delete(name);
    }

    private onTick(): void {
        this.list.forEach((onTick) => {
            onTick(this.app.ticker.elapsedMS, this.app.ticker.lastTime);
        });
    }
}
