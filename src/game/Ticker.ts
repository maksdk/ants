type TickHook = (dt: number, totalTime: number) => void;

export class Ticker {
    private app: PIXI.Application;
    private list: { [name: string]: TickHook };

    constructor(app: PIXI.Application) {
        this.app = app;
        this.list = {};

        this.onTick = this.onTick.bind(this);

        this.app.ticker.add(this.onTick.bind(this));
    }

    has(name: string): boolean {
        return !!this.list[name];
    }

    add(name: string, onTick: TickHook): void {
        if (this.has(name)) {
            throw new Error(`Ticker: You are a little bastard, you can not add '${name}' twice!`);
        }
        this.list[name] = onTick;
    }

    remove(name: string): void {
        if (!this.has(name)) {
            throw new Error(`Ticker: You are a little bastard, the '${name}' does not exist in Ticker list!`);
        }
        delete this.list[name];
    }

    private onTick(dt: number): void {
        Object.values(this.list).forEach((onTick) => onTick(dt, this.app.ticker.lastTime));
    }
}
