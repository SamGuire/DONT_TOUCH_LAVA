import {Vec} from "../gameMechanics/movement.js"
import {State} from "../state.js"

class Coin {
    constructor(pos,basePos,wobble) {
        this.pos = pos
        this.basePos = basePos
        this.wobble = wobble
    }
    get type() {
        return "coin"
    }
    static create(pos){
        let basePos = pos.plus(new Vec(0.2,0.1))
        return new Coin(basePos,basePos,Math.random() * Math.PI * 2)
    }
}

Coin.prototype.size = new Vec(0.6,0.6)



const wobbleSpeed = 8
let wobbleDist = 0.07

Coin.prototype.update = function(time){
    let wobble = this.wobble + time * wobbleSpeed
    // wobblePos make the coin go up and down using Math.sin with space between vertically aligned coins (wobbleDist)
    let wobblePos = Math.sin(wobble) * wobbleDist
    return new Coin(this.basePos.plus(new Vec(0,wobblePos)),this.basePos,wobble)
}

Coin.prototype.collide = function(state) {
    // Removes the coin that was in collision with player
    let filtered = state.actors.filter(a => a != this)
    let status = state.status
    // If no coins are present in the level, the game is won
    if (!filtered.some(a => a.type == "coin")) {
        status = "won"
    }
    return new State(state.level,filtered,status)
}


export {Coin,wobbleDist,wobbleSpeed}