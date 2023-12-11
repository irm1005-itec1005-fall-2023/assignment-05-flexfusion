const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const block_size = 40; // size of each block
const canvas_size = Math.floor(Math.min(0.8 * window.innerWidth, 0.8 * window.innerHeight) / block_size) * block_size;
canvas.width = canvas_size - (canvas_size % block_size);
canvas.height = canvas_size - (canvas_size % block_size); 
const num_blocks = Math.floor(canvas_size / block_size);

let snake = [{ x: 9 * block_size, y: 9 * block_size }]; // start in the middle
let direction = 'right';
let food = getRandomPosition();
let gameRunning = false;
let difficulty = 'medium'; // default difficulty
let gameInterval; // variable to store the game loop interval
let difficultyScreenVisible = false;
let score = 0; 
let gameStarted = false;
let countdown = 3; 
let eatSound = document.getElementById('eatSound');
let backgroundMusic = document.getElementById('backgroundMusic');

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
      // Snake ate the apple
      score++; // Increase the score
      food = getRandomPosition();

      // Play the eat sound when the snake eats the apple
      playEatSound();
    } else {
      snake.pop();
    }
  }

  // Update the scoreboard only when the snake eats the apple
  updateScoreboard();
}

function playEatSound() {
  eatSound.currentTime = 0; // Rewind the sound to the beginning
  eatSound.play();
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
  resetScore();
  showScoreboard();
  updateScoreboard(); 
  playBackgroundMusic();
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
  hideScoreboard();
  playBackgroundMusic();
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
      return 170;
    case 'medium':
      return 120;
    case 'hard':
      return 75;
    default:
      return 150;
  }
}

document.addEventListener('keydown', (event) => {
  if (gameRunning) {
    // Get the current direction
    const currentDirection = direction;

    // Set the new direction based on the pressed key
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
        direction = 'up';
        break;
      case 'ArrowDown':
      case 's':
        direction = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
        direction = 'left';
        break;
      case 'ArrowRight':
      case 'd':
        direction = 'right';
        break;
    }

    // Check if the new direction is not opposite to the current direction
    if (
      (currentDirection === 'up' && direction === 'down') ||
      (currentDirection === 'down' && direction === 'up') ||
      (currentDirection === 'left' && direction === 'right') ||
      (currentDirection === 'right' && direction === 'left')
    ) {
      // The new direction is opposite, revert to the previous direction
      direction = currentDirection;
    }
  }
});

const snakeHeadImage = new Image();
snakeHeadImage.src = './images/favicon/orichimaru%20snake.png'; // Update the path to your image file

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw purple pattern
  for (let row = 0; row < num_blocks; row++) {
    for (let col = 0; col < num_blocks; col++) {
      const x = col * block_size;
      const y = row * block_size;

      // Use light purple and very light purple
      const color = (row + col) % 2 === 0 ? '#C1B6CD' : '#E1DCEC';

      ctx.fillStyle = color;
      ctx.fillRect(x, y, block_size, block_size);
    }
  }

  // Draw the snake
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Draw eyes on the head
      const eyeSize = block_size / 5;
      const eyeOffsetX = block_size / 4;
      const eyeOffsetY = block_size / 4;

      // Draw left eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(segment.x + eyeOffsetX, segment.y + eyeOffsetY, eyeSize, 0, 2 * Math.PI);
      ctx.fill();

      // Draw right eye
      ctx.beginPath();
      ctx.arc(segment.x + 3 * eyeOffsetX, segment.y + eyeOffsetY, eyeSize, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // Draw the body of the snake
      ctx.fillStyle = '#7B3F00'; // Green color for the snake body
      ctx.fillRect(segment.x, segment.y, block_size, block_size);
    }
  });

  // Draw food or other elements
  ctx.fillStyle = '#F00';
  ctx.fillRect(food.x, food.y, block_size, block_size);
}
function showGameOverScreen() {
  document.getElementById('gameOverScreen').style.display = 'flex';
  document.getElementById('snakeCanvas').style.display = 'none';
  document.getElementById('gameOverScore').textContent = score; // Updated line
}

// Modify your endGame function
function endGame() {
  gameRunning = false;
  // Hide the canvas
  document.getElementById('snakeCanvas').style.display = 'none';

  // Show the game over screen
  document.getElementById('gameOverScreen').style.display = 'flex';

  // Stop the game loop
  clearInterval(gameInterval);
  hideScoreboard();
}

// Add this function to restart the game
function restartGame() {
  // Hide the game over screen
  document.getElementById('gameOverScreen').style.display = 'none';

  // Reset game variables and start a new game
  snake = [{ x: 9 * block_size, y: 9 * block_size }];
  direction = 'right';
  food = getRandomPosition();
  gameRunning = true;

  // Reset the score to 0
  score = 0;

  // Display the canvas
  document.getElementById('snakeCanvas').style.display = 'block';

  // Show and update the scoreboard
  document.getElementById('scoreboard').style.display = 'block';
  updateScoreboard();

  // Start the game loop
  gameInterval = setInterval(gameLoop, getSpeedForDifficulty(difficulty));

  updateScoreboard();  // Update the scoreboard when the game starts
  playBackgroundMusic();
}

// Add this function to update the scoreboard
function updateScoreboard() {
  document.getElementById('score').textContent = score;
}


function updateScoreboard() {
  console.log('Updating scoreboard:', score);
  document.getElementById('score').textContent = score;
  document.getElementById('gameOverScore').textContent = score; 
}

function incrementScore() {
  score++;
  updateScore();
}

function resetScore() {
  score = 0;
  updateScore();
}

function showScoreboard() {
  document.getElementById('scoreboard').style.display = 'block';
}

function hideScoreboard() {
  document.getElementById('scoreboard').style.display = 'none';
}

function goToMenu() {
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('difficultyScreen').style.display = 'none';
  document.getElementById('snakeCanvas').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';

  // Reset game state
  gameRunning = false;
  clearInterval(gameInterval);
  snake = [{ x: 9 * block_size, y: 9 * block_size }];
  direction = 'right';
  food = getRandomPosition();
  hideScoreboard();
}

// Function to play background music
function playBackgroundMusic() {
  backgroundMusic.play();
}

// Function to pause background music
function pauseBackgroundMusic() {
  backgroundMusic.pause();
}

// Add these functions to handle the settings screen
function showSettingsScreen() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('settingsScreen').style.display = 'block';
}

function hideSettingsScreen() {
  document.getElementById('settingsScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';
}

function changeVolume(volume) {
  // Ensure volume is within the valid range (0.0 to 1.0)
  volume = Math.max(0.0, Math.min(1.0, volume));

  // Set the background music volume
  backgroundMusic.volume = volume;
}
