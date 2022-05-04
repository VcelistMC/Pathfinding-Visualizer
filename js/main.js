const WALL = "wall";
const CELL = "cell";
const VISITED = "visited";
const START = "start";
const END = "end";

class GridModel{
    
    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;
        
        this.init();
    }

    

    init() {
        this.grid2d = [];
        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for (let j = 0; j < this.cols; j++) {
                row.push(0);       
            }
            this.grid2d.push(row);
        }
    }

    setCell(i, j, ele){
        this.grid2d[i][j] = ele;
    }

    getCell(i, j){
        return this.grid2d[i][j]
    }

    setStart(i, j){
        if(this.start === undefined){
            this.start = [i, j]
            this.getCell(i, j).setAttribute('class', START);
            return;
        }
        let newStart = this.getCell(i, j);
        let oldStart = this.getCell(this.start[0], this.start[1]);
        let cellType = newStart.className['baseVal'];

        if(cellType === WALL || cellType === END) return;
        oldStart.setAttribute('class', CELL);
        
        newStart.setAttribute('class', START);
        this.start = [i, j];
    }

    setEnd(i, j){
        if(this.end === undefined){
            this.end = [i, j]
            this.getCell(i, j).setAttribute('class', END);
            return;
        }
        let newEnd = this.getCell(i, j);
        let oldEnd = this.getCell(this.end[0], this.end[1]);
        let cellType = newEnd.className['baseVal'];

        if(cellType === WALL || cellType === START) return;
        oldEnd.setAttribute('class', CELL);
        
        newEnd.setAttribute('class', END);
        this.end = [i, j];
    }


    async dfs(i, j) {
        if(i < 0 || j < 0 || i >= this.rows || j >= this.cols) return;
        let cell = this.getCell(i, j);

        if(cell.className['baseVal'] !== CELL) return;

        cell.setAttribute('class', VISITED);
        await new Promise(r => setTimeout(r, 10));
        await this.dfs(i - 1, j);
        await this.dfs(i, j - 1);
        await this.dfs(i + 1, j);
        await this.dfs(i, j + 1);
    }
}

var mainContainer = document.getElementById("canvas");
const svgNS = "http://www.w3.org/2000/svg";

var rectSvgEle = document.createElementNS(svgNS, 'rect');
rectSvgEle.setAttribute('width', '30');
rectSvgEle.setAttribute('height', '30');
rectSvgEle.style = "-webkit-tap-highlight-color: rgba(0, 0, 0, 0);";
rectSvgEle.setAttribute('class', 'cell');
rectSvgEle.style.stroke = '#000';
rectSvgEle.style.strokeOpacity = 0.2


var gridArray = []
var columnsMax = Math.ceil(mainContainer.clientWidth / 30);
var rowsMax = Math.ceil(mainContainer.clientHeight / 30);
var newGrid = new GridModel(rowsMax, columnsMax);
var leftMargain = mainContainer.getBoundingClientRect().left;
var upperMargain = mainContainer.getBoundingClientRect().top;

// var columnsMax = 150;
// var rowsMax = 150;
var x = 0;
var y = 0;
let currRow = 0;
let currCol = 0;
var grid = new GridModel(rowsMax, columnsMax);
while (true) {
    if(currCol == columnsMax){
        currRow++;
        currCol = 0;
        x = 0;
        y += 30;
    }
    if(currRow == rowsMax){
        break;
    }
    var newEle = rectSvgEle.cloneNode(true);
    newEle.setAttribute('x', x.toString());
    newEle.setAttribute('y', y.toString());
    grid.setCell(currRow, currCol, newEle);
    x += 30;
    mainContainer.appendChild(newEle);
    currCol++;
}
grid.setStart(0,0);
grid.setEnd(rowsMax - 2, columnsMax - 2);



function onMouseMove(mouse) {
    let x = mouse.clientX;
    let y = mouse.clientY;
    let childCords = getIndexFromCords(x, y)
    let child = grid.getCell(childCords[0], childCords[1]);
    let cellType = child.className['baseVal'];
    if(startCaptured){
        grid.setStart(childCords[0], childCords[1]);
    }
    else if(endCaptured){
        grid.setEnd(childCords[0], childCords[1]);
    }
    else if(cellType !== START && cellType !== END)
        child.setAttribute('class', WALL);
}

var startCaptured = false;
var endCaptured = false;
function onMouseDown(mouse) {
    mainContainer.onmousemove = onMouseMove;
    let x = mouse.clientX;
    let y = mouse.clientY;
    let child = document.elementFromPoint(x, y);
    let cellType = child.className['baseVal'];

    if(cellType === WALL){
        child.setAttribute('class', CELL);
    }
    else if(cellType === START){
        startCaptured = true;
    }
    else if(cellType === END){
        endCaptured = true;
    }
    else{
        child.setAttribute('class', WALL);
    }
    
}

mainContainer.addEventListener('mousedown', onMouseDown);


function getIndexFromCords(x, y) {
    x -= Math.round(leftMargain);
    y -= Math.round(upperMargain);
    let i = Math.floor( x / 30 );
    let j = Math.floor( y / 30 );
    return [j, i];
}

document.addEventListener('mouseup', () => { 
    mainContainer.onmousemove = null; 
    startCaptured = false;
    endCaptured = false;
})

