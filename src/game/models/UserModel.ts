import { ResourseTypes, IPlayerResourse } from '@models/interfaces';
import { BaseModel } from '@models/BaseModel';

export class UserModel extends BaseModel {
    private readonly resourses: Map<ResourseTypes, IPlayerResourse> = new Map();

    constructor() {
        super();

        this.resourses.set(ResourseTypes.Corn, { id: 1, type: ResourseTypes.Corn, count: 0 });
        this.resourses.set(ResourseTypes.Leaf, { id: 2, type: ResourseTypes.Leaf, count: 0 });
    }

    public getResourses(): IPlayerResourse[] {
        const result: IPlayerResourse[] = [];
        this.resourses.forEach((r) => result.push({ ...r }));
        return result;
    }

    public addResourse(type: ResourseTypes, value: number): void {
        if (!this.resourses.has(type)) {
            throw new Error(`Such player resourse type: "${type}" is not found !!!`);
        }

        const resourse = this.resourses.get(type) as IPlayerResourse;
        resourse.count += Math.abs(value);

        this.emit('playeModel:addResourse', resourse);
    }

    public useResourse(type: ResourseTypes, value: number): void {
        if (!this.resourses.has(type)) {
            throw new Error(`Such player resourse type: "${type}" is not found !!!`);
        }

        const resourse = this.resourses.get(type) as IPlayerResourse;
        resourse.count -= Math.abs(value);

        this.emit('playeModel:useResourse', resourse);
    }
}
