import { View } from "./View.js";
import { CellType } from "./Enums.js";


// FIXME: model is not defined here i obv know whats wrong, dk how to fix it yet
// still have to figure out how js import works
export function _onMouseMove(mouse) {
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

export function _onMouseDown(mouse) {
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

export function _onMouseUp() {
    View.mainContainer.onmousemove = null;
    controller.endCellCaptured = false;
    controller.startCellCaptured = false;
}