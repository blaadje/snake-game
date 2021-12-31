const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const width = 600;
const height = 600;
const projectionX = width / 2;
const projectionY = height / 2;
const size = 15
const leftLimit = (-projectionX / size)
const rightLimit = (projectionX / size) - 1
const bottomLimit = (-projectionY / size)
const topLimit = (projectionY / size) - 1
const speed = 2
const DIRECTION_UP = 'up'
const DIRECTION_DOWN = 'down'
const DIRECTION_LEFT = 'left'
const DIRECTION_RIGHT = 'right'
const snakeLength = 3

let food = generateFood()
let interval = null
let direction = DIRECTION_LEFT
let snake = generateSnake(snakeLength)
let tempSnake = []
let score = setScore(0)

canvas.width = width;
canvas.height = height;

context.translate(projectionX, projectionY);

function createNode(x = 0, y = 0) {
  return { x, y }
}

function getRandomArbitrary(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateFood() {
  const x = getRandomArbitrary(leftLimit, rightLimit)
  const y = getRandomArbitrary(bottomLimit, topLimit)

  return createNode(x, y)
}

function generateSnake(amount = 3) {
  return Array.from({ length: amount }).map((_, index) => {
    return createNode(index)
  })
}

function createGrid() {
  for (let x = -projectionX; x <= projectionX; x += size) {
    context.beginPath();
    context.moveTo(x, -projectionX);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let y = -projectionY; y <= projectionY; y += size) {
    context.beginPath();
    context.moveTo(-projectionY, y);
    context.lineTo(width, y);
    context.stroke();
  }
}

function hasCollision(firstNode, secondNode) {
  return firstNode.x === secondNode.x && firstNode.y === secondNode.y
}

function moveRectangle({ x, y }) {
  if (x > rightLimit) {
    return { x: leftLimit, y }
  }

  if (x < leftLimit) {
    return { x: rightLimit, y }
  }

  if (y > topLimit) {
    return { x, y: bottomLimit }
  }

  if (y < bottomLimit) {
    return { x, y: topLimit }
  }

  switch (direction) {
    case DIRECTION_RIGHT: {
      return { x: x += 1, y }
    }
    case DIRECTION_LEFT: {
      return { x: x -= 1, y }
    }
    case DIRECTION_UP: {
      return { x, y: y -= 1 }
    }
    case DIRECTION_DOWN: {
      return { x, y: y += 1 }
    }
  }
}

function roundRect(x, y, w, h, radius) {
  const r = x + w;
  const b = y + h;

  context.moveTo(x + radius, y);
  context.lineTo(r - radius, y);
  context.quadraticCurveTo(r, y, r, y + radius);
  context.lineTo(r, y + h - radius);
  context.quadraticCurveTo(r, b, r - radius, b);
  context.lineTo(x + radius, b);
  context.quadraticCurveTo(x, b, x, b - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.fill();
}

function drawRectangle({ x, y }) {
  context.beginPath();
  context.fillStyle = '#1d2231';
  roundRect(x * size, y * size, size, size, 6)
}

function growSnake() {
  const lastNode = snake[snake.length - 1]

  snake.push(createNode(lastNode))
}

function hasSelfCollision(head) {
  const [_head, ...body] = snake

  return body.some((node, index) => {
    return hasCollision(head, node)
  })
}

function setScore(score) {
  const scoreElement = document.getElementById('score')

  scoreElement.innerText = score

  return score
}

function drawSnake() {
  if (tempSnake.length) {
    const head = moveRectangle(tempSnake[0])

    snake[0] = head

    if (hasSelfCollision(head)) {
      score = setScore(0)
      snake = generateSnake(snakeLength)
      tempSnake = []
      direction = DIRECTION_LEFT
      alert('game over')
      return
    }

    if (hasCollision(head, food)) {
      score = setScore(score + 1)
      growSnake()
      food = generateFood()
    }

    for (let i = 1; i < tempSnake.length; i++) {
      snake[i] = tempSnake[i - 1]
    }
  }

  for (let i = 0; i < snake.length; i++) {
    const node = snake[i]

    drawRectangle(node)
  }

  tempSnake = [...snake]
}

function draw() {
  // Reset Canvas
  context.fillStyle = '#b0cb9e'
  context.fillRect(-projectionX, -projectionY, width, height)

  // Do stuff
  // createGrid()
  drawRectangle(food)
  drawSnake()
}

interval = setInterval(draw, 100)

function handleKeyPress({ key }) {
  switch (key) {
    case 'ArrowLeft': {
      if (direction === DIRECTION_RIGHT) {
        return
      }

      direction = DIRECTION_LEFT
      return
    }

    case 'ArrowRight': {
      if (direction === DIRECTION_LEFT) {
        return
      }

      direction = DIRECTION_RIGHT
      return
    }

    case 'ArrowDown': {
      if (direction === DIRECTION_UP) {
        return
      }

      direction = DIRECTION_DOWN
      return
    }

    case 'ArrowUp': {
      if (direction === DIRECTION_DOWN) {
        return
      }

      direction = DIRECTION_UP
      return
    }
  }
}

window.addEventListener('keydown', handleKeyPress)



