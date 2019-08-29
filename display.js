

// Helper function to create HTML content and its children.
function elt(name,attrs, ...children) {
    let dom = document.createElement(name)
    for (let attr of Object.keys(attrs)){
        dom.setAttribute(attr,attrs[attr])
    }
    for (let child of children){
        dom.append(child)
    }
    return dom
}



class DOMDisplay {
    constructor(parent,level) {
        this.dom = elt("div",{class : "game"},drawGrid(level))
        this.actorLayer = null
        parent.appendChild(this.dom)
        
    }
    clear() {
        this.dom.remove()
    }
}

const scale = 20

// Draws the level using HTML tables
function drawGrid(level) {
    return elt("table", {
        class : "background",
        style : `width : ${level.width * scale}px`},
        ...level.rows.map(row => elt("tr", {style:
            `height: ${scale}px`},...row.map(type =>
                 elt("td",{class: type}))
        ))

    )
}

// Draws the moving components of the game (player,coin,lava) and scales it to be more visible.
function drawActors(actors){
    return elt("div",{},...actors.map(actor => {
        let rect = elt("div",{class: `actor ${actor.type}`})
        rect.style.width = `${actor.size.x * scale}px`
        rect.style.height = `${actor.size.y * scale}px`
        rect.style.left = `${actor.pos.x * scale}px`
        rect.style.top = `${actor.pos.y * scale}px`
        return rect
    }))
}


DOMDisplay.prototype.syncState = function(state){
    // makes a new player body every time the program syncs (avoids creating a band of rectangles)
    if (this.actorLayer) {
        this.actorLayer.remove()
    }
    // Draws the moving components and places them in the HTML
    this.actorLayer = drawActors(state.actors)
    this.dom.appendChild(this.actorLayer)
    this.dom.className = `game ${state.status}`
    this.scrollPlayerIntoView(state)
}

DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
    let width = this.dom.clientWidth
    let height = this.dom.clientHeight
    let margin = width/3

    let left = this.dom.scrollLeft
    let right = left + width
    let top = this.dom.scrollTop
    let bottom = top + height

    let player = state.player
    let center = player.pos.plus(player.size.times(0.5)).times(scale)
    
    // If player position is past the 2/3 mark of the game screen, scroll left
    if (center.x < left + margin) {
        this.dom.scrollLeft = center.x - margin
        
    }
    // If player position is behind the 1/3 mark of the game screen, scroll right
    else if (center.x > right - margin) {
        this.dom.scrollLeft = center.x + margin - width
    }
    if (center.y < top + margin) {
        this.dom.scrollTop = center.y - margin
    }
    else if (center.y > bottom - margin) {
        this.dom.scrollTop = center.y + margin - height
    }
}

export {DOMDisplay,elt,drawActors,drawGrid,scale}