import { AbstractLayer } from '../../libs/layer';

type LayersCollection = Record<'Background' | 'Game' | 'UI' | 'Transition', AbstractLayer>;

export class Scene extends AbstractLayer {
    private layers: LayersCollection;

    constructor(params: Layer.IData) {
        super(params);

        this.sortableChildren = true;

        this.layers = {
            Transition: this.addChild(Scene.createLayer({ name: 'Transition', zIndex: 300, config: {} })),
            Background: this.addChild(Scene.createLayer({ name: 'Background', zIndex: 0, config: {} })),
            Game: this.addChild(Scene.createLayer({ name: 'Game', zIndex: 100, config: {} })),
            UI: this.addChild(Scene.createLayer({ name: 'UI', zIndex: 200, config: {} }))
        };
    }

    getLayer(name: keyof LayersCollection): AbstractLayer {
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

    static createLayer(params: Layer.IData): AbstractLayer {
        class Layer extends AbstractLayer {
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
        return new Layer(params);
    }
}
