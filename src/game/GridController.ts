import { Vector2 } from 'math-threejs';
import { AStarFinder, DiagonalMovement, Grid, Util } from 'pathfinding';
import { randomInt } from '@game/helpers';

interface IGridPath {
    x: number;
    y: number;
}

export class GridController {
    private finder: AStarFinder;
    private grid: Grid;
    private cellW: number;
    private cellH: number;

    constructor(matrix: number[][], cellH: number, cellW: number) {
        this.grid = new Grid(matrix);

        this.finder = new AStarFinder({
            // diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles
            // TODO: данные свойства - depracated. Найти новый pathfinding
            // @ts-ignore
            allowDiagonal: true,
            dontCrossCorners: true
        });

        this.cellW = cellW;
        this.cellH = cellH;
    }

    public toVec2(paths: { x: number; y: number }[]): Vector2[] {
        return paths.map(({ x, y }) => new Vector2(x, y));
    }

    public findSmoothPath(fx: number, fy: number, tx: number, ty: number): IGridPath[] {
        const path = this.finder.findPath(fx, fy, tx, ty, this.grid.clone());
        const smoothenPath = Util.smoothenPath(this.grid, path);
        return this.adaptPath(smoothenPath);
    }

    public fromCoordToIndex(xCoord: number, yCoord: number): IGridPath {
        const x = Math.floor(xCoord / this.cellW);
        const y = Math.floor(yCoord / this.cellH);
        return { x, y };
    }

    public toCoord(path: IGridPath[]): { x: number; y: number }[] {
        return path.map(({ x, y }) => ({
            x: x * this.cellW + this.cellW * 0.5,
            y: y * this.cellH + this.cellH * 0.5
        }));
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

    private adaptPath(path: number[][]): IGridPath[] {
        return path.map(([x, y]) => ({ x, y }));
    }

    // private findPath(fx: number, fy: number, tx: number, ty: number): number[][] {
    //     return this.finder.findPath(fx, fy, tx, ty, this.grid);
    // }
}
