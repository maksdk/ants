import { randomInt } from '@game/helpers';
import { BaseModel } from '@models/BaseModel';
import { IGameResourseSource, ResourseTypes } from '@models/interfaces';

export class GameModel extends BaseModel {
    private resourseSources: IGameResourseSource[] = [
        { id: 1, type: ResourseTypes.Leaf, count: 100, location: { x: 10, y: 10 }, completed: false },
        { id: 2, type: ResourseTypes.Corn, count: 100, location: { x: 15, y: 30 }, completed: false }
    ];

    constructor() {
        super();
    }

    public getResourseSources(): IGameResourseSource[] {
        return [...this.resourseSources];
    }

    public collectResourse(id: number, value: number): void {
        const source = this.resourseSources.find(({ id: resourseId }) => resourseId === id);
        if (!source) {
            throw new Error(`Resourse with id: "${id}" is not found !!!`);
        }

        if (source.completed) {
            return;
        }

        source.count -= value;
        source.count < 0 ? (source.count = 0) : null;

        this.emit('gameModel:collectResourseSource', source);

        if (source.count <= 0) {
            source.completed = true;
            source.count = 0;
            this.emit('gameModel:completeResourseSource', source);
            return;
        }
    }

    public generateResourceSource(type: ResourseTypes): void {
        const id = Math.max(...[...this.resourseSources.values()].map(({ id }) => id));
        const count = randomInt(100, 500);
        const location = { x: randomInt(3, 30), y: randomInt(3, 30) };

        this.resourseSources.push({ id, type, count, location, completed: false });
    }
}
