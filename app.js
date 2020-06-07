// listens for the DOM html (document), fires when html has been loaded
document.addEventListener('DOMContentLoaded', () => {

  // selects the grid
  const grid = document.querySelector('.grid')

  // selects all the divs inside grid and puts in a array
  let squares = Array.from(grid.querySelectorAll('div'))

  const scoreDisplay = document.querySelector('#score')

  // can replace this line by document.getElementById
  const startBtn = document.querySelector('#start-button')

  // each row has 10 squares, so to refer to the row below we add 10, and so on
  const width = 10

  // var that shows the next upcoming tetromino
  let nextTetromino = 0

  // declaring timerID like this initializes it equal to null 
  let timerId

  // keep score
  let score = 0

  // colors for each shape of tetromino
  const colors = ['orange', 'red', 'purple', 'green', 'blue']

  // The Tetrominos

  // L shaped Tetromino
  // each Tetromino has 4 rotation, each rotatio is represented by one array here

  // to refer to the colum to the right we add 1, to refer to the column right of this last column we add 2, and so on. As our tetrominos only have 3x3 sizes we will be only adding 1 or 2 move right (1 or 2 columns) or 10 or 20 to move down (1 or 2 rows)

  // each row has 10 squares, so to refer to the row below we add 10, and so on
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  // array that groups all tetrominos
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  // start postion for tetromino, square of index 4, we draw all the squares relative to this current position. ex: lshaped tetromino starts with the squares 4+1, 4+11,4+21,4+2 =5,15,25,6
  let currentPosition = 4
  let currentRotation = 0

  // randomly select a tetromino and its first rotation
  let tetromino = Math.floor(Math.random() * theTetrominoes.length)

  console.log(tetromino)

  // current tetromino (random) in first rotation position, returns something like 1,11,21,22 which are the positions to draw this tetromino relative to the current position.
  let current = theTetrominoes[tetromino][currentRotation]

  // draw the first rotation in the first tetromino
  function draw() {

    // classList access stylesheet and add class
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[tetromino]
    })
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')

      squares[currentPosition + index].style.backgroundColor = ''

    })
  }

  // assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    }
    else if (e.keyCode === 38) {
      rotate()
    }
    else if (e.keyCode === 39) {
      moveRight()
    }
    else if (e.keyCode === 40) {
      moveDown()
    }
  }

  document.addEventListener('keyup', control)

  // moves the tetromino down every second

  function moveDown() {
    // erases previous position
    undraw()

    // increases base position 
    currentPosition += width

    // draw tetromino in new position 
    draw()

    // check if it hit the bottom and freezes it
    freeze()
  }

  function freeze() {
    // for the next tetromino step (+width), if at least one of the squares has the class taken, which means the tetromino hit the bottom squares, we assign taken to all of the tetromino's squares
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))

      // select a new tetromino to be our current one
      tetromino = nextTetromino
      nextTetromino = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[tetromino][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()  //add to the score and replaces full bottom row for a new clean row on the top
      gameOver()
    }
  }

  // moves the tetromino left, unless it is at the edge or there is a blockage
  function moveLeft() {
    undraw()

    // checks if tetromino is in position 10, 20, 30 and so on. Equivalent to check if divided by width (10) they left no remainder
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -= 1

    // stop if there is another tetromino occupying the space
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      // moves the tetromino backwards so it doesnt overlap the other tetromino
      currentPosition += 1
    }

    draw()

  }

  // moves the tetromino right, unless it is at the edge or there is a blockage
  function moveRight() {
    undraw()

    // checks if tetromino is in position 9, 18, 27 and so on. Equivalent to check if divided by width (10) they left no remainder
    const isAtRightEdge = current.some(index => (currentPosition + index) % (width) === width - 1)

    // if not at the edge, can move
    if (!isAtRightEdge) currentPosition += 1

    // stop if there is another tetromino occupying the space
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      // moves the tetromino backwards so it doesnt overlap the other tetromino
      currentPosition -= 1
    }
    draw()
  }

  // rotate the tetromino
  function rotate() {
    undraw()
    currentRotation++

    // check if rotation is the last in the array
    if (currentRotation === current.length) {
      // goes back to first rotation
      currentRotation = 0
    }
    current = theTetrominoes[tetromino][currentRotation]
    draw()
  }

  // show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  // the tetrominos without rotations (first rotations) to display
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
    [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
    [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
  ]

  // display the shape in the mini-grid display
  function displayShape() {
    // remove any trace of tetrominos from the entire the mini grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })

    upNextTetrominoes[nextTetromino].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')

      displaySquares[displayIndex + index].style.backgroundColor = colors[nextTetromino]

    })
  }

  // add functionality to the start button
  startBtn.addEventListener('click', () => {
    // if we have a timerId value, which means timerId is not null
    if (timerId) {
      // pause the game
      clearInterval(timerId)
      timerId = null
    }
    else {
      // starts or resume the game
      draw()

      // we add a timerId so we can stop setInterval by pressing the button
      timerId = setInterval(moveDown, 1000)

      nextTetromino = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  // add score
  function addScore() {
    for (i = 0; i < 199; i += width) {
      // array with all the squares in the row
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      // check for every square in row if every one of them contain div with class = taken
      if (row.every(index => squares[index].classList.contains('taken'))) {
        // increase score count
        score += 10
        scoreDisplay.innerHTML = score

        // remove the class taken and tetromino so this row will be ready (and yellow) to be cut and put on top of the grid
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''

        })
        // take out the row
        const squaresRemoved = squares.splice(i, width)

        // append new squares to the html grid so the grid doesn't look smaller after removing the bottom squares.
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  // game over
  function gameOver() {
    // if for some of the current tetromino who hasn't been play, if some of his positions contais a class of taken, it is game over. Means that the grid is full and there is no space for the tetromino.
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end' //writes and in the score
      clearInterval(timerId) //stops the game
    }
  }
})