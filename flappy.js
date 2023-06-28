class Board {
  #pipes = []
  #speedX = -2

  #bird
  #canvas
  #gameOver = true
  #pipesInterval
  #animationRequest

  constructor (width, height, canvas) {
    this.width  = width
    this.height = height

    this.#canvas = canvas
    this.#canvas.height = this.height
    this.#canvas.width = this.width

    this.context = this.#canvas.getContext('2d')

    this.#bird = new Bird(15, 15, this)

    this.#addEventListeners()
    this.#drawCleanBoard()
  }

  startGame () {
    this.#pipes = []
    this.#bird.restart()
    this.#startPipes()
    this.#gameOver = false
    this.#animate()
  }

  fly () {
    if (this.#gameOver) {
      this.startGame()
    }
    this.#bird.fly()
  }

  #drawCleanBoard () {
    this.context.fillStyle = '#EEEEEE'
    this.context.fillRect(0, 0, this.width, this.height)
  }

  #startPipes () {
    this.#pipesInterval = setInterval(() => {
      // Add new pipes
      this.#pipes.push(new Pipes(this))
      
      // Clear not visible pipes
      this.#pipes = this.#pipes.filter(pipe => pipe.top.x + pipe.top.width > 0)
    } , 1600)
  }

  #stopPipes () {
    clearInterval(this.#pipesInterval)
  }

  #animate () {
    if (this.#gameOver) return

    this.#animationRequest = requestAnimationFrame(this.#animate.bind(this))
    this.#drawCleanBoard()

    // Bird gravity simulation
    this.#bird.simulateGravity()
    this.#bird.draw()

    // Pipes movement
    for (const pipe of this.#pipes) {
      pipe.top.x += this.#speedX
      pipe.bottom.x += this.#speedX
      pipe.draw()
    }

    // Check Game Over
    this.#gameOver = this.#gameOver || this.#checkBoardCollision()
    this.#gameOver = this.#gameOver || this.#checkPipesCollision()

    if (this.#gameOver) {
      this.#stopPipes()
      cancelAnimationFrame(this.#animationRequest)
      this.context.fillStyle = '#FF0000';
      this.context.font = '40px Arial'
      this.context.fillText('GAME OVER', (this.width / 2 - 130), (this.height / 2))
    }
  }

  #checkBoardCollision () {
    return this.#bird.y <= 0 || this.#bird.y >= this.height - this.#bird.height
  }

  #checkPipesCollision () {
    const bird = this.#bird

    for (const pipeSet of this.#pipes) {
      for (const pipe of [pipeSet.top, pipeSet.bottom]) {
        if (bird.x + bird.width >= pipe.x &&    // bird right edge past pipe left
            bird.x <= pipe.x + pipe.width &&    // bird left edge past pipe right
            bird.y + bird.height >= pipe.y &&   // bird top edge past pipe bottom
            bird.y <= pipe.y + pipe.height) {   // bird bottom edge past pipe top
          return true
        }
      }
    }

    return false
  }

  #addEventListeners () {
    document.addEventListener('keydown', this.#newGameKeyPress.bind(this))
  }

  #newGameKeyPress (event) {
    if (event.code === 'Space' && this.#gameOver) { 
      this.startGame()
    }
  }
}

class Bird {
  x = 30  // Initial x coordinate
  #speedY = 0
  #gravity = 0.15

  constructor (width, height, board) {
    this.width = width
    this.height = height
    this.board = board

    this.y = (this.board.height / 2) - (this.x / 2)

    this.#addEventListeners()
  }

  #addEventListeners () {
    document.addEventListener('keydown', this.move.bind(this))
  }

  fly () {
    this.#speedY = -4
  }

  move (event) {
    if (event.code === 'Space') {
      this.fly()
    }
  }

  simulateGravity () {
    this.#speedY += this.#gravity
    this.y = Math.max(this.y + this.#speedY, 0)
    this.y = Math.min(this.board.height - this.height, this.y)
  }

  draw () {
    this.board.context.fillStyle = '#FF0000'
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }

  restart () {
    this.#speedY = 0
    this.x = 30  // Initial x coordinate
    this.y = (this.board.height / 2) - (this.x / 2)
  }
}

class Pipes {
  constructor (board) {
    this.board = board

    const width = 40

    const minSize = this.board.height * 0.1
    const openSpace = this.board.height * 0.3

    const height = this.board.height - minSize

    const minY = minSize
    const maxY = this.board.height - minSize - openSpace
    const randomY =  Math.floor(Math.random() * (maxY - minY + 1)) + minY

    this.top = {
      x: this.board.width,
      y: randomY - height,
      height: height,
      width: width
    }
  
    this.bottom = {
      x: this.board.width,
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

window.addEventListener('load', function() {
  const canvas = document.getElementById('canvas')
  window.board = new Board(300, 600, canvas)
})