import { AbstractLayer } from '../../libs/layer';

class SceneLayer extends AbstractLayer {
    resize(): void {
        /*do nothing here for now*/
    }
    update(): void {
        /*do nothing here for now*/
    }
    cleanup(): void {
        /*do nothing here for now*/
    }
}

type LayersCollection = Record<'Background' | 'Game' | 'UI' | 'Transition', SceneLayer>;

export class Scene extends AbstractLayer {
    private layers: LayersCollection;

    constructor(params: Layer.IData) {
        super(params);

        this.sortableChildren = true;

        this.layers = {
            Transition: this.addChild(new SceneLayer({ name: 'Transition', zIndex: 300, config: {} })),
            Background: this.addChild(new SceneLayer({ name: 'Background', zIndex: 0, config: {} })),
            Game: this.addChild(new SceneLayer({ name: 'Game', zIndex: 100, config: {} })),
            UI: this.addChild(new SceneLayer({ name: 'UI', zIndex: 200, config: {} }))
        };
    }

    getLayer(name: keyof LayersCollection): SceneLayer {
        return this.layers[name];
    }

    resize(): void {
        /*do nothing here for now*/
    }
    update(): void {
        /*do nothing here for now*/
    }
    cleanup(): void {
        /*do nothing here for now*/
    }
}
