import { AStarFinder, DiagonalMovement, Grid, Util } from 'pathfinding';
import { randomInt } from '@game/helpers';

interface IGridCell {
    x: number;
    y: number;
}

export class GridController {
    private finder: AStarFinder;
    private grid: Grid;

    constructor(matrix: number[][]) {
        this.grid = new Grid(matrix);

        this.finder = new AStarFinder({
            diagonalMovement: DiagonalMovement.Always
        });
    }

    public findPath(fx: number, fy: number, tx: number, ty: number): number[][] {
        return this.finder.findPath(fx, fy, tx, ty, this.grid);
    }

    public findSmoothPath(fx: number, fy: number, tx: number, ty: number): number[][] {
        return Util.smoothenPath(this.grid, this.findPath(fx, fy, tx, ty));
    }

    public findRandomPathInArea(fx: number, fy: number, area: { x: number; y: number }[]): IGridCell[] {
        if (!this.grid.isInside(fx, fy)) {
            throw new Error(`Points: "x: ${fx}" and "y: ${fy}" is not inside of Grid !!!`);
        }

        const randomIndex = randomInt(0, area.length - 1);
        const randomCell = area[randomIndex];
        const path = this.findSmoothPath(fx, fy, randomCell.x, randomCell.y);

        return path.map(([x, y]) => ({ x, y }));
    }

    public getFreeNeighbors(fx: number, fy: number): { x: number; y: number }[] | never {
        if (!this.grid.isInside(fx, fy)) {
            throw new Error(`Points: "x: ${fx}" and "y: ${fy}" is not inside of Grid !!!`);
        }

        const node = { x: fx, y: fy, walkable: this.grid.isWalkableAt(fx, fy) };

        const neighbors = this.grid.getNeighbors(node, DiagonalMovement.OnlyWhenNoObstacles);

        return neighbors.filter(({ walkable }) => !!walkable).map(({ x, y }) => ({ x, y }));
    }

    public getFreeDeepNeighbors(fx: number, fy: number, r: number): { x: number; y: number }[] | never {
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
}
