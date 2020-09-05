import { Container, Point } from 'pixi.js';
import { Component, Types } from 'ecsy';
import { Vector2, Path } from 'math-threejs';

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

export interface IMovementComponent {
    start: Point;
    end: Point;
    progress: number;
    speed: number;
}

export class MovementComponent<C> extends Component<C> {
    public start: Point = new Point();
    public end: Point = new Point();
    public progress = 0;
    public speed = 20;
}

MovementComponent.schema = {
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

export interface IPathFindingComponent {
    start: Vector2;
    end: Vector2;
}

export class PathFindingComponent<C> extends Component<C> {
    public start: Vector2 = new Vector2();
    public end: Vector2 = new Vector2();
}

PathFindingComponent.schema = {
    start: {
        type: Types.Ref,
        default: new Vector2()
    },
    end: {
        type: Types.Ref,
        default: new Vector2()
    }
};

export interface IPathMovingComponent {
    path: Path;
    length: number;
    speed: number;
    progress: number;
}

export class PathMovingComponent<C> extends Component<C> {
    public path: Path = new Path();
    public length = 0;
    public speed = 10;
    public progress = 0;
}

PathMovingComponent.schema = {
    path: {
        type: Types.Ref,
        default: new Path()
    },
    length: {
        type: Types.Number,
        default: 0
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
