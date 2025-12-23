class Offscreen {
  private _canvasElement: HTMLCanvasElement = null
  private _context: CanvasRenderingContext2D = null

  get canvasElement () {
    return this._canvasElement
  }

  get context () {
    return this._context
  }

  getImage (): ImageData {
    return this._context.getImageData(0, 0, this._canvasElement.width, this._canvasElement.height)
  }

  constructor (width: number, height: number) {
    const canvasElement = <HTMLCanvasElement> document.createElement('canvas')
    canvasElement.width = width
    canvasElement.height = height
    const context = <CanvasRenderingContext2D> canvasElement.getContext('2d')
    this._canvasElement = canvasElement
    this._context = context
  }
}

export {
  Offscreen
}
