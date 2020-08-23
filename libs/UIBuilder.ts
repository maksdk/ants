import { Container, Sprite, TextStyle, Text, Graphics } from "pixi.js";

export class UIBuilder {
    static modifiersList: string[];
    static methodsMap: Builder.IDictionaryMethods;

    static strokeRect({ rectWidth = 10, rectHeight = 10, width = 2, color = 0x000000 } = {}): PIXI.Graphics {
        const rect = new Graphics()
            .lineStyle(width, color)
            .drawRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight)
            .endFill();
        return rect;
    }

    static rect({ rectWidth = 10, rectHeight = 10, color = 0x000000, alpha = 1 } = {}): PIXI.Graphics {
        const rect = new Graphics()
            .beginFill(color, alpha)
            .drawRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight)
            .endFill();
        return rect;
    }

    static fromConfig(treeConfig: Builder.ITreeConfig[]): PIXI.Container[] {
        return treeConfig.map((config) => {
            const methodName: Builder.Methods = UIBuilder.methodsMap[config.type];
            const el = UIBuilder[methodName](config);
            if (config.children) {
                //@ts-ignore
                el.addChild(...UIBuilder.fromConfig(config.children));
            }
            return el;
        });
    }

    static createContainer({ name, modifiers }: Builder.IContainerConfig): PIXI.Container {
        const container = new Container();
        this._useModifiers<Container>(container, modifiers);
        container.name = name;
        return container;
    }

    static createSprite({ name, textureName, modifiers }: Builder.ISpriteConfig): PIXI.Sprite {
        const sprite = Sprite.from(textureName);
        this._useModifiers<Sprite>(sprite, modifiers);
        sprite.name = name;
        return sprite;
    }

    static createText({ name, text = "", style = {}, modifiers }: Builder.ITextConfig): PIXI.Text {
        const txt = new Text(text, new TextStyle(style));
        this._useModifiers<Text>(txt, modifiers);
        txt.name = name;
        return txt;
    }

    private static _useModifiers<T extends PIXI.DisplayObject>(target: T, modifiers: Builder.IModifiers = {}): void {
        const filtered = UIBuilder.modifiersList.filter((prop) => {
            return Boolean(modifiers[prop]);
        });

        filtered.forEach((prop) => {
            this._modify<T>(target, prop, modifiers[prop]);
        });
    }

    private static _modify<T extends PIXI.DisplayObject>(
        target: T,
        property: string,
        modifier: Builder.Modifier
    ): void {
        if (typeof modifier !== "object") {
            //@ts-ignore
            target[property] = modifier;
        } else {
            //@ts-ignore
            target[property] = Object.assign(target[property], modifier);
        }
    }
}

UIBuilder.methodsMap = {
    Container: "createContainer",
    Sprite: "createSprite",
    Text: "createText",
};

UIBuilder.modifiersList = [
    // basic DisplayObject props
    "position",
    "scale",
    "width",
    "height",
    "alpha",
    "zIndex",
    "rotation",
    // for Sprite
    "anchor",
];
