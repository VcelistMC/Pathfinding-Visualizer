var mainContainer = document.getElementById("canvas");
const svgNS = "http://www.w3.org/2000/svg";

var rectSvgEle = document.createElementNS(svgNS, 'rect');
rectSvgEle.setAttribute('width', '30');
rectSvgEle.setAttribute('height', '30');
rectSvgEle.style = "-webkit-tap-highlight-color: rgba(0, 0, 0, 0);";
rectSvgEle.style.fill = '#EEEEEE';
rectSvgEle.style.stroke = '#000';
rectSvgEle.style.strokeOpacity = 0.2

var gridArray = []
var columnsMax = Math.ceil(mainContainer.clientWidth / 30);
var rowsMax = Math.ceil(mainContainer.clientHeight / 30);
console.log(columnsMax, rowsMax);

// var columnsMax = 150;
// var rowsMax = 150;
var x = 0;
var y = 0;
let currRow = 0;
let currCol = 0;
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
    x += 30;
    gridArray.push(newEle);
    mainContainer.appendChild(newEle);
    currCol++;
}

function modColor(child) {
    // console.log("shhwqeq");
    child.style.fill = "#0000"
}

// let squareArray = document.getElementsByTagName("rect");
// Array.from(squareArray).forEach(function(elem) {
//     elem.addEventListener("click", () => { modColor(elem); });
// });

function onMouseMove(mouse) {
    let child = document.elementFromPoint(mouse.clientX, mouse.clientY);
    modColor(child);
}

mainContainer.addEventListener('mousedown', mouse => {
    mainContainer.onmousemove = onMouseMove;
    let child = document.elementFromPoint(mouse.clientX, mouse.clientY);
    modColor(child);
})

mainContainer.addEventListener('mouseup', ()=>{
    mainContainer.onmousemove = null;
})