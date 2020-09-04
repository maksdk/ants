import { AStarFinder, DiagonalMovement, Grid, Util } from 'pathfinding';

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
}
