import { Container, Sprite, TextStyle, Text, Graphics } from 'pixi.js';
import Builder = Core.Builder;

export class UIBuilder {
    public static modifiersList: string[];
    public static methodsMap: Builder.IDictionaryMethods;

    public static strokeRect({ rectWidth = 10, rectHeight = 10, width = 2, color = 0x000000 } = {}): PIXI.Graphics {
        const rect = new Graphics()
            .lineStyle(width, color)
            .drawRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight)
            .endFill();
        return rect;
    }

    public static rect({ rectWidth = 10, rectHeight = 10, color = 0x000000, alpha = 1 } = {}): PIXI.Graphics {
        const rect = new Graphics()
            .beginFill(color, alpha)
            .drawRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight)
            .endFill();
        return rect;
    }

    public static fromConfig(treeConfig: Builder.ITreeConfig[]): PIXI.Container[] {
        return treeConfig.map((config) => {
            const methodName: Builder.Methods = UIBuilder.methodsMap[config.type];
            const el = UIBuilder[methodName](config);
            if (config.children) {
                el.addChild(...UIBuilder.fromConfig(config.children));
            }
            return el;
        });
    }

    public static createContainer({ name, modifiers }: Builder.IContainerConfig): PIXI.Container {
        const container = new Container();
        this.useModifiers<Container>(container, modifiers);
        container.name = name;
        return container;
    }

    public static createSprite({ name, textureName, modifiers }: Builder.ISpriteConfig): PIXI.Sprite {
        const sprite = Sprite.from(textureName);
        this.useModifiers<Sprite>(sprite, modifiers);
        sprite.name = name;
        return sprite;
    }

    public static createText({ name, text = '', style = {}, modifiers }: Builder.ITextConfig): PIXI.Text {
        const txt = new Text(text, new TextStyle(style));
        this.useModifiers<Text>(txt, modifiers);
        txt.name = name;
        return txt;
    }

    private static useModifiers<T extends PIXI.DisplayObject>(target: T, modifiers: Builder.IModifiers = {}): void {
        const filtered = UIBuilder.modifiersList.filter((prop) => {
            return Boolean(modifiers[prop]);
        });

        filtered.forEach((prop) => {
            this.modify<T>(target, prop, modifiers[prop]);
        });
    }

    private static modify<T extends PIXI.DisplayObject>(target: T, property: string, modifier: Builder.Modifier): void {
        if (typeof modifier !== 'object') {
            //@ts-ignore
            target[property] = modifier;
        } else {
            //@ts-ignore
            target[property] = Object.assign(target[property], modifier);
        }
    }
}

UIBuilder.methodsMap = {
    Container: 'createContainer',
    Sprite: 'createSprite',
    Text: 'createText'
};

UIBuilder.modifiersList = [
    // basic DisplayObject props
    'position',
    'scale',
    'width',
    'height',
    'alpha',
    'zIndex',
    'rotation',
    // for Sprite
    'anchor'
];
