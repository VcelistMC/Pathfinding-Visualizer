import { PathFinder } from "./Pathfinder.js";
import { CellType } from "../../models/Enums.js";
import { Queue } from "../../models/Queue.js";
export class BFS extends PathFinder{ 
    constructor(controller, rows, cols) {
        super(controller, rows, cols);
    }

    start() {
        console.log(this);
        let startCell = this.controller.getStart();
        this.find(startCell[0], startCell[1]);
    }
    // TODO: A better way to approach the coloring of the grid, is to store all vi
    // visited cells into array and color them AFTER the algorithm terminates,
    // either by finding the goal or having no more space
    // who knows? 
    async find(i, j) {
        let q = new Queue();
        q.enqueue([i, j]);
        let directions = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ];
        while (!q.isEmpty && !this.endReached) {
            let cords = q.dequeue();
            i = cords[0];
            j = cords[1];
            let currCell = this.controller.getCell(i, j);

            if (currCell === CellType.END) {
                this.endReached = true;
                return;
            }
            if(currCell !== CellType.START){
                this.controller.setCell(i, j, CellType.VISITED);
            }
            // await new Promise(r => setTimeout(r, 10));

            for(let dir = 0; dir < directions.length; dir++){
                let newI = i + directions[dir][0];
                let newJ = j + directions[dir][1];

                if(newI < 0 || newJ < 0 || newI >= this.rows || newJ >= this.cols) 
                    continue;
                
                let newCell = this.controller.getCell(newI, newJ);
                
                if(newCell === CellType.WaLL || newCell === CellType.VISITED) 
                    continue;
                
                q.enqueue([newI, newJ]);
            };
        }
    }
}