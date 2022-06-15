// Cell type enum
import { CellType } from "./models/Enums.js";
import { Model } from "./models/Model.js";
import { View } from "./view/View.js";
import { Controller } from "./controllers/Controller.js";
import { DFS } from "./algorihms/Pathfinders/DFS.js";
import { PathFinder } from "./algorihms/Pathfinders/Pathfinder.js";
import { BFS } from "./algorihms/Pathfinders/BFS.js";




var columnsMax = Math.ceil(View.mainContainer.clientWidth / 30);
var rowsMax = Math.ceil(View.mainContainer.clientHeight / 30);
console.log(rowsMax, columnsMax);
let pointsX = Math.round(rowsMax / 2);
let startPointY = Math.round(columnsMax / 4);
let endPointsY = Math.round((3*columnsMax) / 4);

var model = new Model(rowsMax, columnsMax);
var view = new View(rowsMax, columnsMax);
model.registerObserver(view);

var controller = new Controller(model, view);

controller.setStart(pointsX, startPointY);
controller.setEnd(pointsX, endPointsY);
var algo = new BFS(controller, rowsMax, columnsMax);

document.addEventListener('dblclick', () => algo.start());