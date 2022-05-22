import { View } from "./View.js";
import { _onMouseDown, _onMouseUp, _onMouseMove } from "./EventListeners.js";

export class Controller {

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

