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

    setStart(start){
        this.start = start;
    }

    setEnd(end){
        this.end = end;
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


function onMouseMove(mouse) {
    let x = mouse.clientX;
    let y = mouse.clientY;
    let child = document.elementFromPoint(x, y);
    child.setAttribute('class', WALL);
}

mainContainer.addEventListener('mousedown', mouse => {
    mainContainer.onmousemove = onMouseMove;
    let x = mouse.clientX;
    let y = mouse.clientY;
    console.log(x,y );
    let child = document.elementFromPoint(x, y);
    if(child.className['baseVal'] === WALL){
        child.setAttribute('class', CELL);
    }
    else{
        child.setAttribute('class', WALL);
    }
    
    let cords = getIndexFromCords(x,y)    
    grid.dfs(cords[0], cords[1]);
})


function getIndexFromCords(x, y) {
    x -= Math.round(leftMargain);
    y -= Math.round(upperMargain);
    let i = Math.floor( x / 30);
    let j = Math.floor( y / 30);
    return [j, i];
}

document.addEventListener('mouseup', ()=>{
    mainContainer.onmousemove = null;
})

