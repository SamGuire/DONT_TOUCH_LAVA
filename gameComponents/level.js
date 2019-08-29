
import {Player} from  "./player.js"
import {Coin} from  "./coin.js"
import {Lava} from  "./lava.js"
import {Vec} from "../gameMechanics/movement.js"


const levelChars = {
    "." : "empty",
    "#" : "wall",
    "+" : "lava",
    "@" : Player,
    "o" : Coin,
    "=" : Lava,
    "|" : Lava,
    "v" : Lava
}


class Level {
    constructor(plan) {

        // Create array of characters representing the level plan (map function seperates each row into an array of characters using the newline character as a seperator)
        let rows = plan.trim().split("\n").map(l => [...l])
        this.height = rows.length
        this.width = rows[0].length
        this.startActors = [];

        // Maps through each row of the array (second argument indicating the index of the row)

        //Creates a matrix of elements describing what appears in that (x,y) coordinate. EX : "+" will be described as "lava" in the new matrix.

        this.rows = rows.map((row,y) => {
            // Maps through each character of the row (second argument indicating the index within the row)
            return row.map((ch,x) => { 
                let type = levelChars[ch]
                if (typeof type == "string") return type
                this.startActors.push(type.create(new Vec(x,y),ch))
                return "empty"
        })
    })
    }
}



Level.prototype.touches = function(pos,size,type){
    // Examines the whole body of the player x1,y1 (top-left corner of player body) until x2,y2 (bottom-right of the player body)
    var xStart = Math.floor(pos.x)
    var xEnd = Math.ceil(pos.x + size.x)

    var yStart = Math.floor(pos.y)
    var yEnd = Math.ceil(pos.y + size.y)

    for (var y = yStart ; y < yEnd ; y++){
        for (var x = xStart ; x < xEnd ; x++) {
            // Checks if the player tries the leave the game window (if so it counts as a wall)
            let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height
            let here = isOutside ? "wall" : this.rows[y][x]
            // If the player touches the game component in question return true
            if (here == type){ 
                return true
            }
        }
    }
    return false
}

export {Level}