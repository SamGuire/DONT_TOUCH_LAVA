function trackKeys(keys) {
    let down = Object.create(null)
    function track(event){
        if (keys.includes(event.key)){
            // If the key is pressed down, element in the array representing that key is represented as a true value, false otherwise
            down[event.key] = event.type == "keydown"
            // prevent default action of pressing the key
            event.preventDefault()
        }
    }
    // Event listerner is the key is pressed of not
    window.addEventListener("keydown",track)
    window.addEventListener("keyup",track)
    return down
}

class Vec {
    constructor(x,y){
        this.x = x
        this.y = y
    }
    plus(other) {
        return new Vec(this.x + other.x,this.y + other.y)
    }
    times(factor){
        return new Vec(this.x*factor, this.y*factor)
    }
}

// Keys to keep track of.
const arrowKeys = trackKeys(["ArrowLeft","ArrowRight","ArrowUp"])


export {arrowKeys,Vec,trackKeys}