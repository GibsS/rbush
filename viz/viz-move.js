// HTML
var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 400

var fpsDiv = document.createElement('div')
var configDiv = document.createElement('div')

var countLabel = document.createElement('span')
countLabel.innerText = 'Number of elements'
var countInput = document.createElement('input')
countInput.type = 'text'

var speedLabel = document.createElement('span')
speedLabel.innerText = 'Speed'
var speedInput = document.createElement('input')
speedInput.type = 'text'

var startBtn = document.createElement('button')
startBtn.innerText = 'restart'

document.body.appendChild(canvas)
document.body.appendChild(fpsDiv)
configDiv.appendChild(countLabel)
configDiv.appendChild(countInput)
configDiv.appendChild(speedLabel)
configDiv.appendChild(speedInput)
document.body.appendChild(configDiv)
document.body.appendChild(startBtn)

startBtn.onclick = () => {
    count = parseInt(countInput.value)
    speed = parseFloat(speedInput.value)
    init()
}

// FPS INFO
let now,
    fps = 0,
    lastFrame = new Date,
    fpsSmoothing = 50

// RTREE
let tree
let elements

let count = 50
let speed = 20

function init() {
    tree = new rbush()
    elements = []

    for(let i = 0; i < count; i++) {
        let x = Math.random() * (canvas.width - 50) + 25, y = Math.random() * (canvas.height - 50) + 25
        let element = {
            minX: x,
            maxX: x,
            minY: y,
            maxY: y,
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed
        }

        elements.push(element)
        tree.insert(element)
    }
}
function update() {
    let x, y
    for(let e of elements) {
        x = e.minX + e.vx / 100
        y = e.minY + e.vy / 100
        tree.update(e, x, y, x, y)
        if(x < 25 || x > canvas.width - 25) e.vx = - e.vx
        if(y < 25 || y > canvas.height - 25) e.vy = - e.vy
    }
}
function display() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let queue = [],
        current = tree.data

    while(current) {
        if(current.children) {
            queue.push.apply(queue, current.children)
        }
        if(current.minX == current.maxX) {
            ctx.beginPath()
            ctx.arc(current.minX, current.minY, 5, 0, 2 * Math.PI)
            ctx.stroke()
        } else {
            ctx.rect(current.minX, current.minY, current.maxX - current.minX, current.maxY - current.minY)
            ctx.stroke()
        }
        current = queue.pop()
    }
}

function renderFrame() {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    update()
    display()

    now = new Date()
    var frameFPS = 1000/ (now - lastFrame)
    fps = (frameFPS - fps) / fpsSmoothing
    lastFrame = now

    setTimeout(renderFrame, 16)
}

function showFPS() {
    fpsDiv.innerText = (fps*100).toFixed(1)
    setTimeout(showFPS, 1000)
}

init()
renderFrame()
showFPS()