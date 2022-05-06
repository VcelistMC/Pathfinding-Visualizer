export class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.startCellCaptured = false;
        this.endCellCaptured = false;

        View.mainContainer.onmousedown = _onMouseDown;
        View.mainContainer.onmouseup = _onMouseUp;
    }

    setStart(i, j){
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

}