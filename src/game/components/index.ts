import { Container, Point } from 'pixi.js';
import { Component, Types } from 'ecsy';

export interface ISoldierComponent {
    object: Container;
}

export class SoldierComponent<C> extends Component<C> {
    public object = new Container();
}

SoldierComponent.schema = {
    object: {
        type: Types.Ref,
        default: new Container()
    }
};

export interface IMovingComponent {
    start: Point;
    end: Point;
    progress: number;
    speed: number;
}

export class MovingComponent<C> extends Component<C> {
    public start: Point = new Point();
    public end: Point = new Point();
    public progress = 0;
    public speed = 20;
}

MovingComponent.schema = {
    start: {
        type: Types.Ref,
        default: new Point()
    },
    end: {
        type: Types.Ref,
        default: new Point()
    },
    speed: {
        type: Types.Number,
        default: 20
    },
    progress: {
        type: Types.Number,
        default: 0
    }
};

export interface IAntComponent {
    object: Container;
}

export class AntComponent<C> extends Component<C> {
    public object = new Container();
}

AntComponent.schema = {
    object: {
        type: Types.Ref,
        default: new Container()
    }
};

export interface IGuardPatrollingComponent {
    start: Point;
    end: Point;
    progress: number;
    speed: number;
    radius: number;
}

export class GuardPatrollingComponent<C> extends Component<C> {
    public start: Point = new Point();
    public end: Point = new Point();
    public progress = 0;
    public speed = 5;
    public radius = 100;
}

GuardPatrollingComponent.schema = {
    start: {
        type: Types.Ref,
        default: new Point()
    },
    end: {
        type: Types.Ref,
        default: new Point()
    },
    speed: {
        type: Types.Number,
        default: 5
    },
    progress: {
        type: Types.Number,
        default: 0
    },
    radius: {
        type: Types.Number,
        default: 100
    }
};

export interface IGuardFollowingComponent {
    start: Point;
    end: Point;
    progress: number;
    speed: number;
}

export class GuardFollowingComponent<C> extends Component<C> {
    public start: Point = new Point();
    public end: Point = new Point();
    public progress = 0;
    public speed = 10;
}

GuardFollowingComponent.schema = {
    start: {
        type: Types.Ref,
        default: new Point()
    },
    end: {
        type: Types.Ref,
        default: new Point()
    },
    speed: {
        type: Types.Number,
        default: 10
    },
    progress: {
        type: Types.Number,
        default: 0
    }
};
