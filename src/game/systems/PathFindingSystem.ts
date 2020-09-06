import { System, World } from 'ecsy';
import { Path } from 'math-threejs';
import { PathFindingComponent, IPathFindingComponent, PathMovingComponent } from '@game/components';
import { GridController } from '@game/GridController';

export class PathFindingSystem extends System {
    private gridController: GridController;

    constructor(world: World, attributes: IPathFindingSystemAttributes) {
        super(world, attributes);

        const { gridController } = attributes;

        this.gridController = gridController;
    }

    public execute(): void {
        const entities = this.queries.entities.results;
        entities.forEach((entity) => {
            const pathFindingComponent = entity.getComponent(PathFindingComponent) as IPathFindingComponent;
            const { start, end } = pathFindingComponent;

            const fromIndex = this.gridController.fromCoordToIndex(start.x, start.y);
            const toIndex = this.gridController.fromCoordToIndex(end.x, end.y);
            const path = this.gridController.findSmoothPath(fromIndex.x, fromIndex.y, toIndex.x, toIndex.y);
            const coordPath = this.gridController.toCoord(path);

            const pathCurve = new Path(this.gridController.toVec2(coordPath));
            const pathLenght = pathCurve.getLength();

            if (entity.hasComponent(PathMovingComponent)) {
                entity.removeComponent(PathMovingComponent);
            }

            entity.addComponent(PathMovingComponent, {
                path: pathCurve,
                length: pathLenght
            });

            entity.removeComponent(PathFindingComponent);
        });
    }
}

PathFindingSystem.queries = {
    entities: { components: [PathFindingComponent] }
};

interface IPathFindingSystemAttributes {
    gridController: GridController;
}
