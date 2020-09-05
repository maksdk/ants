import { Sprite, Container } from 'pixi.js';
import { World, Entity, Component, ComponentConstructor } from 'ecsy';

export class BaseEntity extends Container {
    private entity: Entity;

    constructor(world: World, name: string) {
        super();
        this.entity = world.createEntity(name);
    }

    public addComponent<C extends Component<unknown>>(
        component: ComponentConstructor<C>,
        values?: Partial<Omit<C, keyof Component<unknown>>>
    ): void {
        this.entity.addComponent(component, values);
    }

    public getComponent<C extends Component<unknown>>(
        Component: ComponentConstructor<C>,
        includeRemoved?: boolean
    ): Readonly<C> | undefined {
        return this.entity.getComponent(Component, includeRemoved);
    }

    public getMutableComponent<C extends Component<unknown>>(component: ComponentConstructor<C>): C | undefined {
        return this.entity.getMutableComponent(component);
    }

    public removeComponent<C extends Component<unknown>>(
        component: ComponentConstructor<C>,
        forceImmediate?: boolean | undefined
    ): void {
        this.entity.removeComponent(component, forceImmediate);
    }

    public hasComponent<C extends Component<unknown>>(
        component: ComponentConstructor<C>,
        includeRemoved?: boolean | undefined
    ): boolean {
        return this.entity.hasComponent(component, includeRemoved);
    }

    public destroy(): void {
        this.entity.remove();
        super.destroy();
    }
}

export class AntEntity extends BaseEntity {
    constructor(world: World, name: string) {
        super(world, name);
        const sprite = Sprite.from('ant');
        sprite.tint = 0x0000ff;
        sprite.anchor.set(0.5);
        sprite.scale.set(0.35);
        this.addChild(sprite);
    }
}

export class AntSoldierEntity extends BaseEntity {
    constructor(world: World, name: string) {
        super(world, name);
        const sprite = Sprite.from('ant');
        sprite.tint = 0x000000;
        sprite.anchor.set(0.5);
        sprite.scale.set(0.5);
        this.addChild(sprite);
    }
}
