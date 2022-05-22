import { NotifType } from "./Enums.js";
export class View {
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