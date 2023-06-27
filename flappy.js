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


window.onload = function() {
    board.canvas = document.getElementById('canvas')
    board.canvas.height = board.height
    board.canvas.width = board.width
    board.ctx = board.canvas.getContext('2d')

    board.ctx.fillStyle = '#eee'
    board.ctx.fillRect(0, 0, board.width, board.height)

    board.ctx.fillStyle = 'red'
    board.ctx.fillRect(bird.x, bird.y, bird.width, bird.height)
}