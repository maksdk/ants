import { GridController } from '@game/GridController';
import { Path } from 'math-threejs';
import { System, Not, World } from 'ecsy';
import {
    WorkerComponent,
    IWorkerComponent,
    ResourseSearchingComponent,
    ResourseSavingComponent,
    ResourseCollectionComponent,
    ResourseDeliveryComponent,
    ResourseMiningComponent,
    IResourseCollectionComponent,
    IResourseSearchingComponent,
    IResourseSavingComponent,
    IResourseDeliveryComponent,
    IResourseMiningComponent,
    SpawnComponent
} from '@game/components';

interface IResourseCollectionSystemAttributes {
    gridController: GridController;
}

export class ResourseCollectionSystem extends System {
    private gridController: GridController;

    constructor(world: World, attributes: IResourseCollectionSystemAttributes) {
        super(world, attributes);

        const { gridController } = attributes;

        this.gridController = gridController;
    }

    public execute(dt: number): void {
        const normDelta = dt / 100;

        const searchers = this.queries.searchers.results;
        searchers.forEach((entity) => {
            const workerComponent = entity.getComponent(WorkerComponent) as IWorkerComponent;
            const collectionComponent = entity.getComponent(
                ResourseCollectionComponent
            ) as IResourseCollectionComponent;
            const searchingComponent = entity.getMutableComponent(
                ResourseSearchingComponent
            ) as IResourseSearchingComponent;

            const fromPos = workerComponent.object.position;
            const toPos = collectionComponent.soursePoint;

            if (searchingComponent.progress === 0) {
                searchingComponent.path = this.createPath(fromPos, toPos);
                searchingComponent.length = searchingComponent.path.getLength();
            }

            let currProgress =
                searchingComponent.progress + normDelta * (searchingComponent.speed / searchingComponent.length);
            if (currProgress > 1) currProgress = 1;
            searchingComponent.progress = currProgress;

            const newPos = searchingComponent.path.getPoint(searchingComponent.progress);
            const dy = newPos.y - fromPos.y;
            const dx = newPos.x - fromPos.x;
            const rotation = Math.atan2(dy, dx);

            workerComponent.object.position.set(newPos.x, newPos.y);

            if (searchingComponent.progress === 1) {
                entity.removeComponent(ResourseSearchingComponent);
                entity.addComponent(ResourseMiningComponent);
            } else {
                workerComponent.object.rotation = rotation;
            }
        });

        const miners = this.queries.miners.results;
        miners.forEach((entity) => {
            const miningComponent = entity.getMutableComponent(ResourseMiningComponent) as IResourseMiningComponent;

            miningComponent.elapsedTime += dt;
            if (miningComponent.elapsedTime >= miningComponent.maxTime) {
                entity.removeComponent(ResourseMiningComponent);
                entity.addComponent(ResourseDeliveryComponent);
            }
        });

        const deliverers = this.queries.deliverers.results;
        deliverers.forEach((entity) => {
            const workerComponent = entity.getComponent(WorkerComponent) as IWorkerComponent;
            const collectionComponent = entity.getComponent(
                ResourseCollectionComponent
            ) as IResourseCollectionComponent;
            const deliveryComponent = entity.getMutableComponent(
                ResourseDeliveryComponent
            ) as IResourseDeliveryComponent;

            const fromPos = workerComponent.object.position;
            const toPos = collectionComponent.storagePoint;

            if (deliveryComponent.progress === 0) {
                deliveryComponent.path = this.createPath(fromPos, toPos);
                deliveryComponent.length = deliveryComponent.path.getLength();
            }

            let currProgress =
                deliveryComponent.progress + normDelta * (deliveryComponent.speed / deliveryComponent.length);
            if (currProgress > 1) currProgress = 1;
            deliveryComponent.progress = currProgress;

            const newPos = deliveryComponent.path.getPoint(deliveryComponent.progress);
            const dy = newPos.y - fromPos.y;
            const dx = newPos.x - fromPos.x;
            const rotation = Math.atan2(dy, dx);

            workerComponent.object.position.set(newPos.x, newPos.y);

            if (deliveryComponent.progress === 1) {
                entity.removeComponent(ResourseDeliveryComponent);
                entity.addComponent(ResourseSavingComponent);
            } else {
                workerComponent.object.rotation = rotation;
            }
        });

        const savers = this.queries.savers.results;
        savers.forEach((entity) => {
            const savingComponent = entity.getMutableComponent(ResourseSavingComponent) as IResourseSavingComponent;

            savingComponent.elapsedTime += dt;
            if (savingComponent.elapsedTime >= savingComponent.maxTime) {
                entity.removeComponent(ResourseSavingComponent);
                entity.addComponent(ResourseSearchingComponent);
            }
        });
    }

    private createPath(from: { x: number; y: number }, to: { x: number; y: number }): Path {
        const fromIndex = this.gridController.fromCoordToIndex(from.x, from.y);
        const toIndex = this.gridController.fromCoordToIndex(to.x, to.y);
        const path = this.gridController.findSmoothPath(fromIndex.x, fromIndex.y, toIndex.x, toIndex.y);
        const coordPath = this.gridController.toCoord(path);

        const pathCurve = new Path(this.gridController.toVec2(coordPath));
        return pathCurve;
    }
}

ResourseCollectionSystem.queries = {
    searchers: {
        components: [Not(SpawnComponent), WorkerComponent, ResourseCollectionComponent, ResourseSearchingComponent]
    },
    deliverers: {
        components: [Not(SpawnComponent), WorkerComponent, ResourseCollectionComponent, ResourseDeliveryComponent]
    },
    miners: {
        components: [Not(SpawnComponent), WorkerComponent, ResourseCollectionComponent, ResourseMiningComponent]
    },
    savers: { components: [Not(SpawnComponent), WorkerComponent, ResourseCollectionComponent, ResourseSavingComponent] }
};
