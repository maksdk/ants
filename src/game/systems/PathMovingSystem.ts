import { System } from 'ecsy';
import { PathMovingComponent, IPathMovingComponent, AntComponent, IAntComponent } from '@game/components';

export class PathMovingSystem extends System {
    public execute(dt: number): void {
        const normDelta = dt / 100;
        const entities = this.queries.entities.results;

        entities.forEach((entity) => {
            const movementComponent = entity.getMutableComponent(PathMovingComponent) as IPathMovingComponent;
            const { speed, path, progress, length } = movementComponent;

            const antComponent = entity.getMutableComponent(AntComponent) as IAntComponent;
            const { object } = antComponent;

            let currProgress = progress + normDelta * (speed / length);
            if (currProgress > 1) currProgress = 1;
            movementComponent.progress = currProgress;

            const fromPos = object.position;
            const toPos = path.getPoint(currProgress);
            const dy = toPos.y - fromPos.y;
            const dx = toPos.x - fromPos.x;
            const rotation = Math.atan2(dy, dx);

            object.position.set(toPos.x, toPos.y);

            if (progress === 1) {
                entity.removeComponent(PathMovingComponent);
            } else {
                object.rotation = rotation;
            }
        });
    }
}

PathMovingSystem.queries = {
    entities: { components: [AntComponent, PathMovingComponent] }
};
