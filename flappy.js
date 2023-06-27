class Board {
  constructor (width, height, canvas) {
    this.width  = width
    this.height = height
    this.canvas = canvas

    this.canvas.height = this.height
    this.canvas.width = this.width

    this.context = this.canvas.getContext('2d')
  }

  drawCleanBoard () {
    this.context.fillStyle = '#EEEEEE'
    this.context.fillRect(0, 0, this.width, this.height)
  }
}

class Bird {
  constructor (width, height, board) {
    this.width = width
    this.height = height
    this.board = board

    this.x = 10 // Initial x coordinate
    this.y = (this.board.height / 2) - (this.x / 2)
  }

  draw () {
    this.board.context.fillStyle = '#FF0000'
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }
}

class Pipes {
  constructor (x, board) {
    this.board = board

    const width = 40
    const height = this.board.height
    const minSize = height * 0.1
    const openSpace = height * 0.3

    const minY = minSize
    const maxY = this.board.height - minSize - openSpace
    const randomY =  Math.floor(Math.random() * (maxY - minY + 1)) + minY

    this.top = {
      x: x,
      y: randomY - height,
      height: height,
      width: width
    }
  
    this.bottom = {
      x: x,
      y: randomY + openSpace,
      height: height,
      width: width
    }
  } 

  draw () {
    this.board.context.fillStyle = '#006600'
    this.board.context.fillRect(this.top.x, this.top.y, this.top.width, this.top.height)
    this.board.context.fillRect(this.bottom.x, this.bottom.y, this.bottom.width, this.bottom.height)
  }
}

window.onload = function() {
  const canvas = document.getElementById('canvas')
  const board = new Board(800, 600, canvas)
  const bird = new Bird(20, 20, board)
  const pipes = new Pipes(50, board)

  board.drawCleanBoard()
  bird.draw()
  pipes.draw()
}