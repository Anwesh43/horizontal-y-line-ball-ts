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