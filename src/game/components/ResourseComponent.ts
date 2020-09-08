import { Component, Types } from 'ecsy';
import { Vector2, Path } from 'math-threejs';

export interface IResourseCollectionComponent {
    soursePoint: Vector2;
    storagePoint: Vector2;
    soursePointIndex: { x: number; y: number };
    storagePointIndex: { x: number; y: number };
    type: string;
}

export class ResourseCollectionComponent<C> extends Component<C> {
    public soursePoint!: Vector2;
    public storagePoint!: Vector2;
    public soursePointIndex = { x: 0, y: 0 };
    public storagePointIndex = { x: 0, y: 0 };
    public type = 'none';
}

ResourseCollectionComponent.schema = {
    soursePoint: {
        type: Types.Ref,
        default: new Vector2()
    },
    storagePoint: {
        type: Types.Ref,
        default: new Vector2()
    },
    soursePointIndex: {
        type: Types.Ref,
        default: { x: 0, y: 0 }
    },
    storagePointIndex: {
        type: Types.Ref,
        default: { x: 0, y: 0 }
    },
    type: {
        type: Types.String,
        default: 'none'
    }
};

export interface IResourseSearchingComponent {
    path: Path;
    length: number;
    speed: number;
    progress: number;
}

export class ResourseSearchingComponent<C> extends Component<C> {
    public speed = 5 * Math.random() + 3;
    public progress = 0;
    public length = 0;
    public path!: Path;

    public reset(): void {
        this.progress = 0;
        this.speed = 5 * Math.random() + 3;
    }
}

ResourseSearchingComponent.schema = {
    path: {
        type: Types.Ref,
        default: undefined
    },
    length: {
        type: Types.Number,
        default: 0
    },
    progress: {
        type: Types.Number,
        default: 0
    },
    speed: {
        type: Types.Number,
        default: 5 * Math.random() + 3
    }
};

export interface IResourseDeliveryComponent {
    path: Path;
    length: number;
    speed: number;
    progress: number;
}

export class ResourseDeliveryComponent<C> extends Component<C> {
    public speed = 2.5 * Math.random() + 2;
    public progress = 0;
    public length = 0;
    public path!: Path;

    public reset(): void {
        this.progress = 0;
        this.speed = 2.5 * Math.random() + 2;
    }
}

ResourseDeliveryComponent.schema = {
    path: {
        type: Types.Ref,
        default: undefined
    },
    length: {
        type: Types.Number,
        default: 0
    },
    progress: {
        type: Types.Number,
        default: 0
    },
    speed: {
        type: Types.Number,
        default: 2.5 * Math.random() + 2
    }
};

export interface IResourseMiningComponent {
    maxTime: number;
    elapsedTime: number;
}

export class ResourseMiningComponent<C> extends Component<C> {
    public readonly maxTime = 3000;
    public elapsedTime = 0;

    public reset(): void {
        this.elapsedTime = 0;
    }
}

ResourseMiningComponent.schema = {
    maxTime: {
        type: Types.Number,
        default: 5
    },
    elapsedTime: {
        type: Types.Number,
        default: 0
    }
};

export interface IResourseSavingComponent {
    maxTime: number;
    elapsedTime: number;
}

export class ResourseSavingComponent<C> extends Component<C> {
    public readonly maxTime = 3000;
    public elapsedTime = 0;

    public reset(): void {
        this.elapsedTime = 0;
    }
}

ResourseSavingComponent.schema = {
    maxTime: {
        type: Types.Number,
        default: 5
    },
    elapsedTime: {
        type: Types.Number,
        default: 0
    }
};
