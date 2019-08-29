import { GAME_LEVELS } from "./gameLevels.js"
import  {DOMDisplay,elt,drawActors,drawGrid,scale} from "./display.js"
import {Level} from "./gameComponents/level.js"
import {overlap,State} from "./state.js"
import {arrowKeys} from "./gameMechanics/movement.js"

function runAnimation(frameFunc){
    let lastTime = null 
    function frame(time){
        if (lastTime != null) {
            let timeStep = Math.min(time - lastTime,100) / 1000
            // Once time limit is reached
            if (frameFunc(timeStep) === false) {
                return
            }
        }
        lastTime = time
        requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
}

function runLevel(level, Display) {
    let display = new Display(document.body,level)
    let state = State.start(level)
    let ending = 1
    // Animation runs until the promise is resolved and returns a "won" status (reject parameter not needed)
    return new Promise(resolve => {
        runAnimation(time => {
            state = state.update(time,arrowKeys)
            display.syncState(state)
            if (state.status == "playing") {
                return true
            }
            // A time delay once the level has been completed
            else if (ending > 0){
                ending -= time
                return true
            }
            else {
                display.clear()
                resolve(state.status)
                return false
            }
        })
    })
}

// run asynchronous function that starts the game (uses a implicit promise to return its result, does other task at the same time))
async function runGame(plans,Display) {
    for (let level = 0; level < plans.length;){
        let status = await runLevel(new Level(plans[level]),Display)
        if (status == "won"){
            level++
        }
    }
    console.log("You've won!")
}




runGame(GAME_LEVELS,DOMDisplay)