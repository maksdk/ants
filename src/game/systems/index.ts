import { Container } from 'pixi.js';
import { System, Not } from 'ecsy';
import {
    MovingComponent,
    AntComponent,
    GuardPatrollingComponent,
    GuardFollowingComponent,
    SoldierComponent,
    IMovingComponent,
    IAntComponent,
    IGuardPatrollingComponent,
    ISoldierComponent,
    IGuardFollowingComponent
} from '@game/components';
import { randomPointInCircle, distance } from '@game/helpers';

export class MovingSystem extends System {
    public execute(dt: number): void {
        const normDelta = dt / 100;
        const ants = this.queries.entities.results;

        ants.forEach((ant) => {
            const movement = ant.getMutableComponent(MovingComponent) as IMovingComponent;
            const { speed, start, end, progress } = movement;

            const object2D = ant.getMutableComponent(AntComponent) as IAntComponent;
            const { object } = object2D;

            const diffDistX = end.x - start.x;
            const diffDistY = end.y - start.y;

            if (progress === 0) {
                const rotation = Math.atan2(diffDistY, diffDistX);
                object.rotation = rotation;
            }

            const maxDist = Math.abs(diffDistX) > Math.abs(diffDistY) ? Math.abs(diffDistX) : Math.abs(diffDistY);

            let currProgress = progress + normDelta * (speed / maxDist);
            if (currProgress > 1) currProgress = 1;
            movement.progress = currProgress;

            const x = start.x + (end.x - start.x) * currProgress;
            const y = start.y + (end.y - start.y) * currProgress;

            object.position.set(x, y);

            if (progress === 1) {
                ant.removeComponent(MovingComponent);
            }
        });
    }
}

MovingSystem.queries = {
    entities: { components: [AntComponent, MovingComponent] }
};

export class GuardPatrollingSystem extends System {
    public execute(dt: number): void {
        const normDelta = dt / 100;
        const guards = this.queries.guards.results;
        const [target] = this.queries.target.results;
        const targetObject = target.getComponent(AntComponent) as IAntComponent;
        const targetPos = targetObject.object.position.clone();

        guards.forEach((guard) => {
            const guardPatrolligComponent = guard.getMutableComponent(
                GuardPatrollingComponent
            ) as IGuardPatrollingComponent;
            const soldierComponent = guard.getMutableComponent(SoldierComponent) as ISoldierComponent;
            const { start, end, speed, progress, radius } = guardPatrolligComponent;
            const { object } = soldierComponent;

            let dx = end.x - start.x;
            let dy = end.y - start.y;

            if (progress === 0) {
                const startPoint = object.position.clone();
                const endPoint = randomPointInCircle(radius, targetPos.x, targetPos.y);

                guardPatrolligComponent.start = startPoint;
                guardPatrolligComponent.end = endPoint;

                dx = endPoint.x - startPoint.x;
                dy = endPoint.y - startPoint.y;

                const rotation = Math.atan2(dy, dx);
                object.rotation = rotation;
            }

            const maxDist = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

            let currProgress = progress + normDelta * (speed / maxDist);
            if (currProgress > 1) currProgress = 1;
            guardPatrolligComponent.progress = currProgress;

            const x =
                guardPatrolligComponent.start.x +
                (guardPatrolligComponent.end.x - guardPatrolligComponent.start.x) * currProgress;
            const y =
                guardPatrolligComponent.start.y +
                (guardPatrolligComponent.end.y - guardPatrolligComponent.start.y) * currProgress;

            object.position.set(x, y);

            if (progress === 1) {
                guardPatrolligComponent.progress = 0;
            }

            const distToTarget = distance(targetPos, object.position.clone());
            if (distToTarget > radius * 2) {
                guard.removeComponent(GuardPatrollingComponent);
                guard.addComponent(GuardFollowingComponent);
            }
        });
    }
}

GuardPatrollingSystem.queries = {
    guards: { components: [SoldierComponent, GuardPatrollingComponent, Not(GuardFollowingComponent)] },
    target: { components: [AntComponent] }
};

export class GuardFollowingSystem extends System {
    public execute(dt: number): void {
        const normDelta = dt / 100;
        const followers = this.queries.followers.results;
        const [target] = this.queries.target.results;
        const targetObject = target.getComponent(AntComponent) as { object: Container };
        const targetPos = targetObject.object.position.clone();

        followers.forEach((guard) => {
            if (guard.hasComponent(GuardPatrollingComponent)) {
                guard.removeComponent(GuardPatrollingComponent);
            }

            const guardFollowingComponent = guard.getMutableComponent(
                GuardFollowingComponent
            ) as IGuardFollowingComponent;
            const soldierComponent = guard.getMutableComponent(SoldierComponent) as ISoldierComponent;

            const { start, end, speed, progress } = guardFollowingComponent;

            let dx = end.x - start.x;
            let dy = end.y - start.y;

            if (end.x !== targetPos.x && end.y !== targetPos.y) {
                guardFollowingComponent.progress = 0;

                const startPoint = soldierComponent.object.position.clone();
                const endPoint = targetPos;

                guardFollowingComponent.start = startPoint;
                guardFollowingComponent.end = endPoint;

                dx = endPoint.x - startPoint.x;
                dy = endPoint.y - startPoint.y;

                const rotation = Math.atan2(dy, dx);
                soldierComponent.object.rotation = rotation;
            }

            const maxDist = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

            let currProgress = guardFollowingComponent.progress + normDelta * (speed / maxDist);
            if (currProgress > 1) currProgress = 1;
            guardFollowingComponent.progress = currProgress;

            const x =
                guardFollowingComponent.start.x +
                (guardFollowingComponent.end.x - guardFollowingComponent.start.x) * currProgress;
            const y =
                guardFollowingComponent.start.y +
                (guardFollowingComponent.end.y - guardFollowingComponent.start.y) * currProgress;

            soldierComponent.object.position.set(x, y);

            if (progress === 1) {
                guard.removeComponent(GuardFollowingComponent);
                guard.addComponent(GuardPatrollingComponent);
            }
        });
    }
}

GuardFollowingSystem.queries = {
    followers: { components: [SoldierComponent, GuardFollowingComponent, Not(GuardPatrollingComponent)] },
    target: { components: [AntComponent] }
};
