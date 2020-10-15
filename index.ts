const w : number = window.innerWidth 
const h : number = window.innerHeight
const parts : number = 5 
const scGap : number = 0.02 / parts 
const strokeFactor : number = 90 
const lineFactor : number = 3 
const rFactor : number = 8.6 
const backColor : string = "#bdbdbd"
const colors : Array<string> = [
    "#F44336",
    "#4CAF50",
    "#3F51B5",
    "#FF9800",
    "#2196F3"
]
const delay : number = 20
const deg : number = Math.PI / 4


class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }

    static sinify(scale : number) {
        return Math.sin(scale * Math.PI)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor 
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => { 

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}

class Animator {

    animated : boolean = false 
    interval : number 
    
    start(cb : Function) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    static drawHorizontalYLineBall(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / lineFactor 
        const r : number = Math.min(w, h) / rFactor
        const sf : number = ScaleUtil.sinify(scale)
        const sf1 : number = ScaleUtil.divideScale(sf, 0, parts)
        const sf2 : number = ScaleUtil.divideScale(sf, 1, parts)
        const sf3 : number = ScaleUtil.divideScale(sf, 2, parts)
        const sf4 : number = ScaleUtil.divideScale(sf, 3, parts)
        const sf5 : number = ScaleUtil.divideScale(sf, 4, parts) 
        context.save()
        context.translate(w / 2 - size, h / 2)
        DrawingUtil.drawLine(context, 0, 0, size * sf1, 0)
    
        for (var j = 0; j < 2; j++) {
            context.save()
            context.translate(size, 0)
            context.rotate(deg * (1 - 2 * j))
            DrawingUtil.drawLine(context, 0, 0, size * sf2, 0)
            context.restore()
        }
        for (var j = 0; j < 2; j++) {
            context.save()
            context.translate(size * Math.floor(sf4), 0)
            context.rotate(deg * (1 - 2 * j) * Math.floor(sf4))
            DrawingUtil.drawCircle(context, size * (sf5 + sf4 * (1 - Math.floor(sf4))), 0, r * sf3)
            context.restore()
        }
        context.restore()
    }
    
    static drawHYLBNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        DrawingUtil.drawHorizontalYLineBall(context, scale)
    }
}

class HYLBNode {

    prev : HYLBNode 
    next : HYLBNode 
    state : State = new State()

    constructor(private i : number) { 
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new HYLBNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawHYLBNode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : HYLBNode {
        var curr : HYLBNode = this.prev 
        if (dir == 1) {
            curr = this.next 
        }
        if (curr) {
            return curr 
        }
        cb()
        return this 
    }
}