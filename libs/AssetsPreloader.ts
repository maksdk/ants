import { Application, utils } from 'pixi.js';
import has from 'lodash/has';
import FontFaceObserver from 'fontfaceobserver';

type AssetKey = 'images' | 'fonts' | 'atlases';

interface IAssets {
    images?: IAssetsItem[];
    fonts?: IAssetsItem[];
    atlases?: IAssetsItem[];
}

interface IAssetsItem {
    name: string;
    url: string;
}

export class AssetsPreloader extends utils.EventEmitter {
    private assets: IAssets = {};
    private app: Application;
    private options = { crossOrigin: 'anonymous' };
    private loadedItemsCount = 0;
    private totalItemsCount = 0;
    private loadersMap = {
        images: (loader: AssetsPreloader) => loader.loadImages(),
        fonts: (loader: AssetsPreloader) => loader.loadFonts(),
        atlases: (loader: AssetsPreloader) => loader.loadAtlases()
    };
    private onCompleteCb!: () => void;
    private onProgressCb!: (progress: number) => void;
    private promiseResolveCb!: () => void | void[];

    constructor(app: Application, assets: IAssets) {
        super();

        this.app = app;
        this.assets = assets;

        this.totalItemsCount = Object.values(this.assets).reduce((acc, item) => acc + item.length, 0);
    }

    public load(
        onCompleteCb: () => void = () => undefined,
        onProgressCb: (progress: number) => void = (progress: number) => progress
    ): Promise<void> {
        const promises = Object.keys(this.assets).map((key: string) => this.loadersMap[key as AssetKey](this));

        const loadedPromise: Promise<void> = new Promise((resolve) => {
            this.app.loader.load(() => resolve());
        });
        promises.push(loadedPromise);

        this.onProgressCb = onProgressCb;
        this.onCompleteCb = onCompleteCb;

        return new Promise((resolve) => {
            return Promise.all(promises).then(() => {
                this.promiseResolveCb = resolve;
                this.handleComplete();
            });
        });
    }

    private loadImages(): Promise<void> {
        const { images = [] } = this.assets;

        images.forEach(({ name, url }) => {
            if (!has(this.app.loader.resources, name)) {
                this.app.loader.add(name, url, this.options);
            }
        });

        this.app.loader.onProgress.add(() => this.incrementProgress());

        return Promise.resolve();
    }

    private loadAtlases(): Promise<void> {
        const { atlases = [] } = this.assets;

        atlases.forEach(({ name, url }) => {
            if (!has(this.app.loader.resources, name)) {
                this.app.loader.add(name, url, this.options);
            }
        });

        this.app.loader.onProgress.add(() => this.incrementProgress());

        return Promise.resolve();
    }

    private loadFonts(): Promise<void> {
        const { fonts = [] } = this.assets;
        const container = document.getElementsByTagName('head')[0];
        const promises = fonts.map(({ name, url }) => {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(`@font-face { font-family:${name}; src: url(${url}); }`));
            container.appendChild(style);

            return new FontFaceObserver(name).load().then(() => this.incrementProgress());
        });

        return Promise.all(promises).then(() => Promise.resolve());
    }

    private incrementProgress(): void {
        if (this.loadedItemsCount === this.totalItemsCount) return;

        this.loadedItemsCount += 1;

        if (this.onProgressCb) {
            const progress = Math.floor((this.loadedItemsCount / this.totalItemsCount) * 100);
            this.onProgressCb(progress);
            this.emit('assetsPreloader:progress', progress);
        }

        if (this.loadedItemsCount === this.totalItemsCount) {
            this.handleComplete();
        }
    }

    private handleComplete(): void {
        if (!this.promiseResolveCb) return;
        if (this.loadedItemsCount !== this.totalItemsCount) return;

        this.onCompleteCb && this.onCompleteCb();
        this.promiseResolveCb();
        this.emit('assetsPreloader:complete');
    }
}
