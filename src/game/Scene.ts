import { AbstractLayer } from '../../libs/layer';
import Layer = Core.Layer;

class SceneLayer extends AbstractLayer {
    public resize(): void {
        /*do nothing here for now*/
    }
    public update(): void {
        /*do nothing here for now*/
    }
    public cleanup(): void {
        /*do nothing here for now*/
    }
}

type LayersNames = 'Background' | 'Game' | 'UI' | 'Transition';
type LayersCollection = Map<LayersNames, SceneLayer>;

export class Scene extends AbstractLayer {
    private layers: LayersCollection;

    constructor(params: Layer.IData) {
        super(params);

        this.sortableChildren = true;
        this.layers = new Map();

        this.layers.set('Transition', this.addChild(new SceneLayer({ name: 'Transition', zIndex: 300, config: {} })));
        this.layers.set('Background', this.addChild(new SceneLayer({ name: 'Background', zIndex: 0, config: {} })));
        this.layers.set('Game', this.addChild(new SceneLayer({ name: 'Game', zIndex: 100, config: {} })));
        this.layers.set('UI', this.addChild(new SceneLayer({ name: 'UI', zIndex: 200, config: {} })));
    }

    public getLayer(name: LayersNames): SceneLayer {
        const layer = this.layers.get(name);
        if (!layer) {
            throw new Error(`Scene: You are a little bastard, the layer '${name}' does not exist in Scene list!`);
        }
        return layer;
    }

    public resize(): void {
        /*do nothing here for now*/
    }
    public update(): void {
        /*do nothing here for now*/
    }
    public cleanup(): void {
        /*do nothing here for now*/
    }
}
