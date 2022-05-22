// Cell type enum
import { CellType } from "./Enums.js";
import { Model } from "./Model.js";
import { View } from "./View.js";
import { Controller } from "./Controller.js";
class PathFinder {
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

class DFS extends PathFinder {
    constructor(controller, rows, cols) {
        super(controller, rows, cols);
    }
    start() {
        let startCell = this.controller.getStart();
        this.find(startCell[0], startCell[1]);
    }

    async find(i, j) {
        if (i < 0 || j < 0 || i >= this.rows || j >= this.cols || this.endReached)
            return;

        let cell = controller.getCell(i, j);
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

var columnsMax = Math.ceil(View.mainContainer.clientWidth / 30);
var rowsMax = Math.ceil(View.mainContainer.clientHeight / 30);

let pointsX = Math.round(rowsMax / 2);
let startPointY = Math.round(columnsMax / 4);
let endPointsY = Math.round((3*columnsMax) / 4);

var model = new Model(rowsMax, columnsMax);
var view = new View(rowsMax, columnsMax);
model.registerObserver(view);

var controller = new Controller(model, view);

controller.setStart(pointsX, startPointY);
controller.setEnd(pointsX, endPointsY);

