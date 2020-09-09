export interface IGameResourseSource {
    id: number;
    type: ResourseTypes;
    count: number;
    location: { x: number; y: number };
    completed: boolean;
}

export interface IPlayerResourse {
    id: number;
    type: ResourseTypes;
    count: number;
}

export enum ResourseTypes {
    Corn = 'PlayerResourse.Corn',
    Leaf = 'PlayerResourse.Leaf'
}
