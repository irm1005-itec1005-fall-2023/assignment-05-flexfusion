const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const block_size = 30; // size of each block
const canvas_size = Math.min(0.8 * window.innerWidth, 0.8 * window.innerHeight);
canvas.width = canvas_size;
canvas.height = canvas_size;
const num_blocks = Math.floor(canvas_size / block_size); // Ensure blocks fit within the canvas

let snake = [{ x: 9 * block_size, y: 9 * block_size }]; // start in the middle
let direction = 'right';
let food = getRandomPosition();
let gameRunning = false;
let difficulty = 'medium'; // default difficulty
let gameInterval; // variable to store the game loop interval
let difficultyScreenVisible = false;
const speed = getSpeedForDifficulty(difficulty);

function getRandomPosition() {
  const x = Math.floor(Math.random() * num_blocks) * block_size;
  const y = Math.floor(Math.random() * num_blocks) * block_size;
  return { x, y };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00F';
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, block_size, block_size);
  });

  ctx.fillStyle = '#F00';
  ctx.fillRect(food.x, food.y, block_size, block_size);
}

function update() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y -= block_size;
      break;
    case 'down':
      head.y += block_size;
      break;
    case 'left':
      head.x -= block_size;
      break;
    case 'right':
      head.x += block_size;
      break;
  }

  if (
    head.x < 0 || head.x >= canvas_size ||
    head.y < 0 || head.y >= canvas_size ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
  } else {
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      food = getRandomPosition();
    } else {
      snake.pop();
    }
  }
}

function gameLoop() {
  if (gameRunning) {
    update();
    draw();
  }
}

function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('difficultyScreen').style.display = 'none';
  document.getElementById('snakeCanvas').style.display = 'block';
  gameRunning = true;
  gameInterval = setInterval(gameLoop, speed);
}

function showDifficultyScreen() {
  difficultyScreenVisible = true;
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('difficultyScreen').style.display = 'block';
  document.getElementById('snakeCanvas').style.display = 'none';
  clearInterval(gameInterval); // stop the game loop
  updateDifficultyButtons();
}

let gameSpeed = getSpeedForDifficulty(difficulty);

function updateGameSpeed(newDifficulty) {
  difficulty = newDifficulty;
  gameSpeed = getSpeedForDifficulty(difficulty);
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, gameSpeed);
  updateDifficultyButtons();
}

function startGameWithDifficulty(selectedDifficulty) {
  difficultyScreenVisible = false;
  updateGameSpeed(selectedDifficulty);
  document.getElementById('difficultyScreen').style.display = 'none';
  document.getElementById('snakeCanvas').style.display = 'block';
  gameRunning = true;
}


function endGame() {
  gameRunning = false;
  alert('Game Over!');
  snake = [{ x: 9 * block_size, y: 9 * block_size }];
  direction = 'right';
  food = getRandomPosition();
  document.getElementById('snakeCanvas').style.display = 'none';
  if (difficultyScreenVisible) {
    document.getElementById('difficultyScreen').style.display = 'block';
    updateDifficultyButtons();
  } else {
    document.getElementById('startScreen').style.display = 'block';
  }
  clearInterval(gameInterval); // stop the game loop
}

function goBack() {
  document.getElementById('difficultyScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';
}

function updateDifficultyButtons() {
  document.getElementById('easyButton').innerHTML = 'Easy';
  document.getElementById('mediumButton').innerHTML = 'Medium';
  document.getElementById('hardButton').innerHTML = 'Hard';

  switch (difficulty) {
    case 'easy':
      document.getElementById('easyButton').innerHTML += ' &#10004;';
      break;
    case 'medium':
      document.getElementById('mediumButton').innerHTML += ' &#10004;';
      break;
    case 'hard':
      document.getElementById('hardButton').innerHTML += ' &#10004;';
      break;
  }
}

function getSpeedForDifficulty(difficulty) {
  switch (difficulty) {
    case 'easy':
      return 150;
    case 'medium':
      return 100;
    case 'hard':
      return 75;
    default:
      return 100;
  }
}

document.addEventListener('keydown', (event) => {
  if (gameRunning) {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'w':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 's':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'a':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
      case 'd':
        direction = 'right';
        break;
    }
  }
});

const snakeHeadImage = new Image();
snakeHeadImage.src = './images/favicon/orichimaru%20snake.png'; // Update the path to your image file

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw checkered pattern
  for (let row = 0; row < num_blocks; row++) {
    for (let col = 0; col < num_blocks; col++) {
      const x = col * block_size;
      const y = row * block_size;

      // Use light green and very light green
      const color = (row + col) % 2 === 0 ? '#98FB98' : '#C1FFC1';

      ctx.fillStyle = color;
      ctx.fillRect(x, y, block_size, block_size);
    }
  }

  // Draw the snake
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Draw the head using an image
      ctx.drawImage(snakeHeadImage, segment.x, segment.y, block_size, block_size);
    } else {
      // Draw the body of the snake
      ctx.fillStyle = '#008000'; // Green color for the snake body
      ctx.fillRect(segment.x, segment.y, block_size, block_size);
    }
  });

  // Draw food or other elements
  ctx.fillStyle = '#F00';
  ctx.fillRect(food.x, food.y, block_size, block_size);
}

