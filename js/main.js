// Cell type enum
class CellType {
    static CELL = 'cell';
    static WALL = 'wall';
    static VISITED = 'visited';
    static START = 'start';
    static END = 'end';
    static PATH = 'path'
}
// Notif type enum
// will be used in future updates to implment layout changes
class NotifType {
    static CELL_CHANGE = 'cell_change';
}

class Model {
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

class View {
    static _svgNS = "http://www.w3.org/2000/svg";
    static mainContainer = document.getElementById('canvas');
    static leftMargain = View.mainContainer.getBoundingClientRect().left;
    static upperMargain = View.mainContainer.getBoundingClientRect().top;

    static createCell(x, y) {
        let newCell = document.createElementNS(View._svgNS, 'rect');
        newCell.setAttribute('width', '30');
        newCell.setAttribute('height', '30');
        newCell.style = "-webkit-tap-highlight-color: rgba(0, 0, 0, 0);";
        newCell.setAttribute('class', 'cell');
        newCell.style.stroke = '#000';
        newCell.style.strokeOpacity = 0.2;
        newCell.setAttribute('x', x.toString());
        newCell.setAttribute('y', y.toString());

        return newCell;
    }

    constructor(rows, cols) {
        this.cellsRefArray = [];
        this.rows = rows;
        this.cols = cols;

        let currRow = 0;
        let currCol = 0;
        let x = 0;
        let y = 0;

        while (currRow != this.rows) {
            if (currCol == this.cols) {
                currRow++;
                currCol = 0;
                x = 0;
                y += 30;
            }

            let newCell = View.createCell(x, y);
            this.cellsRefArray.push(newCell);
            View.mainContainer.appendChild(newCell);
            x += 30;
            currCol++;
        }
    }

    getCellRef(x, y) {
        let index = (x * this.cols) + y;
        return this.cellsRefArray[index];
    }

    static getIndexFromCords(x, y) {
        x -= Math.round(View.leftMargain);
        y -= Math.round(View.upperMargain);
        let i = Math.floor(x / 30);
        let j = Math.floor(y / 30);
        return [j, i];
    }

    notify(notifType, ...params) {
        switch (notifType) {
            case NotifType.CELL_CHANGE:
                if (params.length != 3) throw "Invalid number of args"
                let i = params[0], j = params[1], newState = params[2];
                let cell = this.getCellRef(i, j);
                cell.setAttribute('class', newState);
                break;

            default:
                break;
        }
    }

}


class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.startCellCaptured = false;
        this.endCellCaptured = false;

        View.mainContainer.onmousedown = _onMouseDown;
        document.onmouseup = _onMouseUp;
    }

    getCell(i, j) {
        return this.model.getCell(i, j);
    }

    setStart(i, j) {
        this.model.setStart(i, j);
    }

    setEnd(i, j) {
        this.model.setEnd(i, j);
    }

    setCell(i, j, newState) {
        this.model.setCell(i, j, newState);
    }

    registerObserver(observer) {
        this.model.registerObserver(observer);
    }

    getStart() {
        return this.model.getStart();
    }

    getEnd() {
        return this.model.getEnd();
    }
}

function _onMouseMove(mouse) {
    let x = mouse.clientX, y = mouse.clientY;

    let childCords = View.getIndexFromCords(x, y);
    let currentCell = model.getCell(childCords[0], childCords[1]);

    if (controller.startCellCaptured) {
        controller.setStart(childCords[0], childCords[1]);
    }
    else if (controller.endCellCaptured) {
        controller.setEnd(childCords[0], childCords[1])
    }
    else if (currentCell !== CellType.START && currentCell !== CellType.END) {
        controller.setCell(childCords[0], childCords[1], CellType.WALL);
    }
}

function _onMouseDown(mouse) {
    View.mainContainer.onmousemove = _onMouseMove;

    let x = mouse.clientX, y = mouse.clientY;
    let childCords = View.getIndexFromCords(x, y);
    let currentCell = model.getCell(childCords[0], childCords[1]);

    if (currentCell === CellType.WALL) {
        controller.setCell(childCords[0], childCords[1], CellType.CELL);
    }
    else if (currentCell === CellType.START) {
        controller.startCellCaptured = true;
    }
    else if (currentCell === CellType.END) {
        controller.endCellCaptured = true;
    }
    else {
        controller.setCell(childCords[0], childCords[1], CellType.WALL);
    }
}

function _onMouseUp() {
    View.mainContainer.onmousemove = null;
    controller.endCellCaptured = false;
    controller.startCellCaptured = false;
}


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

