import { Sprite, Texture } from 'pixi.js';

export class InputHandler extends Sprite {
    private pointerState = 'none';

    constructor(w: number, h: number) {
        super(Texture.EMPTY);

        this.width = w;
        this.height = h;
        this.anchor.set(0.5);

        this.interactive = true;

        this.on('pointerdown', this.onPointerDown, this);
        this.on('pointerup', this.onPointerUp, this);
        this.on('pointerupoutside', this.onPointerUp, this);
        this.on('pointerout', this.onPointerUp, this);
        this.on('pointermove', this.onPointerMove, this);
    }

    public onPointerDown(e: PIXI.InteractionEvent): void {
        if (this.pointerState === 'none') {
            this.pointerState = 'down';
            this.emit('input:down', e, this);
        }
    }

    public onPointerUp(e: PIXI.InteractionEvent): void {
        if (this.pointerState === 'down' || this.pointerState === 'move') {
            this.pointerState = 'none';
            this.emit('input:up', e, this);
        }
    }

    public onPointerMove(e: PIXI.InteractionEvent): void {
        if (this.pointerState === 'down' || this.pointerState === 'move') {
            this.pointerState = 'move';
            this.emit('input:move', e, this);
        }
    }
}
