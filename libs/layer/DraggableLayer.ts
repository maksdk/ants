import { AbstractLayer } from './AbstractLayer';
import Layer = Core.Layer;

export class DraggableLayer extends AbstractLayer implements Layer.IDraggableLayer {
    private isClicked: boolean;
    private pointersId: Array<number>;
    private viewPortSizes: { width: number; height: number };
    private pointerStartPos: { x: number; y: number };
    private moveBy: { dx: number; dy: number };

    constructor({ viewPortSizes, ...layerData }: Layer.IDraggable) {
        super(layerData);

        this.isClicked = false;
        this.pointersId = [];
        this.viewPortSizes = viewPortSizes;

        this.pointerStartPos = { x: 0, y: 0 };
        this.moveBy = { dx: 0, dy: 0 };

        this.on('pointerdown', this.onPointerDown, this);
        this.on('pointermove', this.onPointerMove, this);
        this.on('pointerup', this.onPointerUp, this);
        this.on('pointerupoutside', this.onPointerUp, this);
    }

    /**
     * Activate interactivity of the layer
     */
    activate(): void {
        this.interactive = true;
    }

    /**
     * Deactivate interactivity of the layer
     */
    deactivate(): void {
        this.interactive = false;
    }

    private onPointerDown({ data }: PIXI.InteractionEvent): void {
        if (this.isClicked) {
            return;
        }

        this.pointersId.push(data.pointerId);
        this.isClicked = true;

        this.pointerStartPos = data.getLocalPosition(this);
    }

    private onPointerMove({ data }: PIXI.InteractionEvent): void {
        if (!this.isClicked) {
            return;
        }

        this.calculateMove(data);
    }

    private onPointerUp({ data }: PIXI.InteractionEvent): void {
        if (this.pointersId.indexOf(data.pointerId) !== -1) {
            return;
        }

        this.pointersId = [];
        this.isClicked = false;
    }

    private calculateMove(data: PIXI.InteractionData): void {
        const endPos = data.getLocalPosition(this);
        this.moveBy = {
            dx: endPos.x - this.pointerStartPos.x,
            dy: endPos.y - this.pointerStartPos.y
        };
    }

    private move() {
        const { x, y } = this.position;
        const { width, height } = this.viewPortSizes;
        const bounds = this.getLocalBounds();

        const newX = x + this.moveBy.dx;
        const newY = y + this.moveBy.dy;
        this.moveBy = { dx: 0, dy: 0 };

        const marginW = (bounds.width - width) / 2;
        const marginH = (bounds.height - height) / 2;

        this.position.set(
            Math.min(Math.abs(newX), marginW) * Math.sign(newX),
            Math.min(Math.abs(newY), marginH) * Math.sign(newY)
        );
    }

    update(): void {
        this.move();
    }

    resize(): void {
        // do notheing
    }

    cleanup(): void {
        // do notheing
    }
}
