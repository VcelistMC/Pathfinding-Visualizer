import { CellType, NotifType } from "./Enums.js";

export class Model {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.observers = [];
        this._init();
    }

    _init() {
        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for (let j = 0; j < this.cols; j++) {
                row.push(CellType.CELL);
            }
            this.grid.push(row);
        }
    }

    _notifyObservers(notifType, ...params) {
        this.observers.forEach(observer => {
            observer.notify(notifType, ...params);
        });
    }

    registerObserver(observer) {
        this.observers.push(observer);
    }

    getCell(i, j) {
        return this.grid[i][j];
    }

    setCell(i, j, state) {
        this.grid[i][j] = state;
        this._notifyObservers(NotifType.CELL_CHANGE, i, j, state);
    }

    setStart(i, j) {
        if (this.start != undefined) {
            let newStart = this.getCell(i, j);
            if (newStart === CellType.WALL || newStart === CellType.END)
                return;

            let oldStart = this.start;
            this.setCell(oldStart[0], oldStart[1], CellType.CELL);
        }

        this.setCell(i, j, CellType.START);
        this.start = [i, j]
    }

    getStart() {
        return this.start;
    }

    setEnd(i, j) {
        if (this.end != undefined) {
            let newEnd = this.getCell(i, j);
            if (newEnd === CellType.WALL || newEnd === CellType.START)
                return;

            let oldEnd = this.end;
            this.setCell(oldEnd[0], oldEnd[1], CellType.CELL);
        }

        this.setCell(i, j, CellType.END);
        this.end = [i, j];
    }

    getEnd() {
        return this.end;
    }
}