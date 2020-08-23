
import { StateMachine } from "../libs/fsm/StateMachine";
import { Application, AnimatedSprite, Container } from "pixi.js";
//@ts-ignore
import assets from "../assets/assets.json";

const view: HTMLCanvasElement = (document.body.querySelector("#game-canvas") as HTMLCanvasElement);
const app = new Application({ view });

class Hero extends Container {
    private _heroAnimations: AnimatedSprite[];
    private _currentAnimation: AnimatedSprite;

    constructor(heroAnimations: AnimatedSprite[]) {
        super();
        heroAnimations.forEach(animation => {
            animation.stop();
            animation.visible = false;
            this.addChild(animation);
        })

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
        this._currentAnimation = (
            this._heroAnimations
                .find((animation) => animation.name === name) as AnimatedSprite
        );
        this.show();
    }
}

const getAnimations = (): AnimatedSprite[] => {
    const animations = [
        { animationName: "down", baseName: "tile", start: 130, amount: 9 },
        { animationName: "left", baseName: "tile", start: 117, amount: 9 },
        { animationName: "right", baseName: "tile", start: 143, amount: 9 },
        { animationName: "up", baseName: "tile", start: 104, amount: 9 }
    ];

    return animations.reduce((collection: Array<AnimatedSprite>, config) => {
        const { animationName, baseName, start, amount } = config;

        const tileNames = Array.from({ length: amount })
            .map((_, i) => `${baseName}${start + i}`);

        const animation = AnimatedSprite.fromImages(tileNames);
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
}

app.loader.add(assets.sprites);
app.loader.load(onAssetsLoaded);

const fsm = new StateMachine<PIXI.Application>(app); 
fsm.changeStateTo("");

