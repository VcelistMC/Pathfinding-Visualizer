import { PathFinder } from "./Pathfinder.js";
import { CellType } from "../../models/Enums.js";
export class DFS extends PathFinder {
    constructor(controller, rows, cols) {
        super(controller, rows, cols);
    }
    start() {
        console.log(this);
        let startCell = this.controller.getStart();
        this.find(startCell[0], startCell[1]);
    }

    async find(i, j) {
        if (i < 0 || j < 0 || i >= this.rows || j >= this.cols || this.endReached)
            return;

        let cell = this.controller.getCell(i, j);
        if (cell === CellType.END) {
            this.endReached = true;
            await this._colorPath();
            return;
        }
        if (cell === CellType.VISITED || cell === CellType.WALL)
            return;

        if(cell !== CellType.START) {
            this.path.push([i, j]);
            this.controller.setCell(i, j, CellType.VISITED);
        }

        await new Promise(r => setTimeout(r, 10));

        await this.find(i - 1, j);
        await this.find(i, j - 1);
        await this.find(i + 1, j);
        await this.find(i, j + 1);
        this.path.pop();
    }
}