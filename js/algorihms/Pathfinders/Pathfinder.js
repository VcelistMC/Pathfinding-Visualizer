import { CellType } from "../../models/Enums.js";
export class PathFinder {
    constructor(controller, rows, cols) {
        this.controller = controller;
        this.path = [];
        this.endReached = false;
        this.rows = rows;
        this.cols = cols;
    }

    async _colorPath() {
        for (let i = 0; i < this.path.length; i++) {
            let cell = this.path[i];
            let cellType = this.controller.getCell(cell[0], cell[1]);
            await new Promise(r => setTimeout(r, 10));

            if(cellType === CellType.END || cellType == CellType.START)
                continue;
            this.controller.setCell(cell[0], cell[1], CellType.PATH);
        }
    }
}