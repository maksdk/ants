import { AStarFinder, DiagonalMovement, Grid, Util } from 'pathfinding';
import { System, World } from 'ecsy';
import { randomInt } from '@game/helpers';
import { PathFindingComponent, IPathFindingComponent, PathMovingComponent } from '@game/components';

export class PathFindingSystem extends System {
    private finder: AStarFinder;
    private grid: Grid;
    private cellW: number;
    private cellH: number;

    constructor(world: World, attributes: IPathFindingSystemAttributes) {
        super(world, attributes);

        const { matrix, cellH, cellW } = attributes;

        this.grid = new Grid(matrix);

        this.finder = new AStarFinder({
            diagonalMovement: DiagonalMovement.Never
        });

        this.cellW = cellW;
        this.cellH = cellH;
    }

    public execute(): void {
        const entities = this.queries.entities.results;
        entities.forEach((entity) => {
            const pathFindingComponent = entity.getComponent(PathFindingComponent) as IPathFindingComponent;
            const { start, end } = pathFindingComponent;

            const fromIndex = this.fromCoordToIndex(start.x, start.y);
            const toIndex = this.fromCoordToIndex(end.x, end.y);
            const path = this.findSmoothPath(fromIndex.x, fromIndex.y, toIndex.x, toIndex.y);
            const coordPath = this.toCoord(path);

            entity.removeComponent(PathFindingComponent);

            entity.addComponent(PathMovingComponent, {
                path: coordPath
            });
        });
    }

    private findSmoothPath(fx: number, fy: number, tx: number, ty: number): IGridPath[] {
        const path = this.finder.findPath(fx, fy, tx, ty, this.grid.clone());
        const smoothenPath = Util.smoothenPath(this.grid, path);
        return this.adaptPath(smoothenPath);
    }

    private findRandomPathInArea(fx: number, fy: number, area: { x: number; y: number }[]): IGridPath[] {
        if (!this.grid.isInside(fx, fy)) {
            throw new Error(`Points: "x: ${fx}" and "y: ${fy}" is not inside of Grid !!!`);
        }

        const randomIndex = randomInt(0, area.length - 1);
        const randomCell = area[randomIndex];

        return this.findSmoothPath(fx, fy, randomCell.x, randomCell.y);
    }

    private getFreeNeighbors(fx: number, fy: number): IGridPath[] | never {
        if (!this.grid.isInside(fx, fy)) {
            throw new Error(`Points: "x: ${fx}" and "y: ${fy}" is not inside of Grid !!!`);
        }

        const node = { x: fx, y: fy, walkable: this.grid.isWalkableAt(fx, fy) };

        const neighbors = this.grid.getNeighbors(node, DiagonalMovement.OnlyWhenNoObstacles);

        return neighbors.filter(({ walkable }) => !!walkable).map(({ x, y }) => ({ x, y }));
    }

    private getFreeDeepNeighbors(fx: number, fy: number, r: number): IGridPath[] | never {
        if (!this.grid.isInside(fx, fy)) {
            throw new Error(`Points: "x: ${fx}" and "y: ${fy}" is not inside of Grid !!!`);
        }

        const x0 = fx - r;
        const y0 = fy - r;
        const d = r * 2;
        const result = [];

        for (let y = y0; y < y0 + d; y += 1) {
            for (let x = x0; x < x0 + d; x += 1) {
                if (!this.grid.isInside(x, y)) continue;

                const isWalkable = this.grid.isWalkableAt(x, y);

                if (isWalkable) {
                    result.push({ x, y });
                }
            }
        }

        return result;
    }

    private fromCoordToIndex(xCoord: number, yCoord: number): IGridPath {
        const x = Math.floor(xCoord / this.cellW);
        const y = Math.floor(yCoord / this.cellH);
        return { x, y };
    }

    private toCoord(path: IGridPath[]): { x: number; y: number }[] {
        return path.map(({ x, y }) => ({ x: x * this.cellW, y: y * this.cellH }));
    }

    private adaptPath(path: number[][]): IGridPath[] {
        return path.map(([x, y]) => ({ x, y }));
    }

    // private findPath(fx: number, fy: number, tx: number, ty: number): number[][] {
    //     return this.finder.findPath(fx, fy, tx, ty, this.grid);
    // }
}

PathFindingSystem.queries = {
    entities: { components: [PathFindingComponent] }
};

interface IGridPath {
    x: number;
    y: number;
}

interface IPathFindingSystemAttributes {
    matrix: number[][];
    cellW: number;
    cellH: number;
}
