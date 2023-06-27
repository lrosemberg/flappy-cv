// Configuration
const board = {
  width: 800,
  height: 600,
  canvas: undefined,
  ctx: undefined
}

const bird = {
  width: 20,
  height: 20,
  x: 10,
  y: (board.height / 2) - 10
}

const pipe = {
  height: board.height,
  width: 40,
  minPipeSize: board.height * 0.1,
  openSpace: board.height * 0.3
}


window.onload = function() {
  board.canvas = document.getElementById('canvas')
  board.canvas.height = board.height
  board.canvas.width = board.width
  board.ctx = board.canvas.getContext('2d')

  board.ctx.fillStyle = '#eee'
  board.ctx.fillRect(0, 0, board.width, board.height)

  board.ctx.fillStyle = 'red'
  board.ctx.fillRect(bird.x, bird.y, bird.width, bird.height)

  buildPipes()
}

function buildPipes () {
  const newPipe = new Pipes(50)
  newPipe.draw()
}

function Pipes (x) {
  this.x = x || 0

  const minY = pipe.minPipeSize
  const maxY = board.height - pipe.minPipeSize - pipe.openSpace
  const randomY =  Math.floor(Math.random() * (maxY - minY + 1)) + minY

  this.top = {
    x: this.x,
    y: randomY - pipe.height,
    height: pipe.height,
    width: pipe.width
  }

  this.bottom = {
    x: this.x,
    y: randomY + pipe.openSpace,
    height: pipe.height,
    width: pipe.width
  }

  this.draw = function () {
    board.ctx.fillStyle = 'green'
    board.ctx.fillRect(this.top.x, this.top.y, this.top.width, this.top.height)
    board.ctx.fillRect(this.bottom.x, this.bottom.y, this.bottom.width, this.bottom.height)
  }
}
