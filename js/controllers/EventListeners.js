import { View } from "../view/View.js";
import { CellType } from "../models/Enums.js";


export function _onMouseMove(mouse, controller) {
    let x = mouse.clientX, y = mouse.clientY;

    let childCords = View.getIndexFromCords(x, y);
    let currentCell = controller.getCell(childCords[0], childCords[1]);

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

export function _onMouseDown(mouse, controller) {
    View.mainContainer.onmousemove = (mouse) => {_onMouseMove(mouse, controller)};

    let x = mouse.clientX, y = mouse.clientY;
    let childCords = View.getIndexFromCords(x, y);
    let currentCell = controller.getCell(childCords[0], childCords[1]);

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

export function _onMouseUp(controller) {
    View.mainContainer.onmousemove = null;
    controller.endCellCaptured = false;
    controller.startCellCaptured = false;
}