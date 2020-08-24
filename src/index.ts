import { AssetsPreloader } from "./AssetsPreloader";
import { Application, AnimatedSprite, Container } from "pixi.js";
import assets from "../assets/assets.json";

import { GameConfig } from "./configs/GameConfig";
const gameConfig = new GameConfig();
const { application, gameCanvasId } = gameConfig;

application.view = document.body.querySelector(gameCanvasId) as HTMLCanvasElement;
const app: PIXI.Application = new Application(application);

class Hero extends Container {
    private _heroAnimations: PIXI.AnimatedSprite[];
    private _currentAnimation: PIXI.AnimatedSprite;

    constructor(heroAnimations: PIXI.AnimatedSprite[]) {
        super();
        heroAnimations.forEach((animation) => {
            animation.stop();
            animation.visible = false;
            this.addChild(animation);
        });

        this._currentAnimation = heroAnimations[0];
        this._heroAnimations = heroAnimations;
    }

    hide(): void {
        this._currentAnimation.stop();
        this._currentAnimation.visible = false;
    }

    show(): void {
        this._currentAnimation.visible = true;
        this._currentAnimation.play();
    }

    play(name: "down" | "left" | "right" | "up"): void {
        this.hide();
        this._currentAnimation = this._heroAnimations.find(
            (animation) => animation.name === name
        ) as PIXI.AnimatedSprite;
        this.show();
    }
}

const getAnimations = (): PIXI.AnimatedSprite[] => {
    const animations = [
        { animationName: "down", baseName: "tile", start: 130, amount: 9 },
        { animationName: "left", baseName: "tile", start: 117, amount: 9 },
        { animationName: "right", baseName: "tile", start: 143, amount: 9 },
        { animationName: "up", baseName: "tile", start: 104, amount: 9 },
    ];

    return animations.reduce((collection: Array<PIXI.AnimatedSprite>, config) => {
        const { animationName, baseName, start, amount } = config;

        const tileNames = Array.from({ length: amount }).map((_, i) => `${baseName}${start + i}`);

        const animation: PIXI.AnimatedSprite = AnimatedSprite.fromImages(tileNames);
        animation.name = animationName;
        animation.anchor.set(0.5);
        animation.animationSpeed = 24 / 60;

        collection.push(animation);
        return collection;
    }, []);
};

const onAssetsLoaded = () => {
    const heroAnimations = getAnimations();
    const hero = new Hero(heroAnimations);
    hero.position.set(200, 200);
    hero.scale.set(2);
    hero.play("right");
    app.stage.addChild(hero);
};

const onAssetsLoadProgress = (percentProgress: number) => {
    console.log("Progress: ", percentProgress);
};

const assetsPreloader = new AssetsPreloader(app, assets);
assetsPreloader.load(onAssetsLoaded, onAssetsLoadProgress);
