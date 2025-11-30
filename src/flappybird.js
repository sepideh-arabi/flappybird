// ===== Canvas setup =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// ===== Images (sprites) =====
const bgImg = new Image();
bgImg.src = "flappybirdbg.png";

const birdImg = new Image();
birdImg.src = "flappybird.png";

const pipeTopImg = new Image();
pipeTopImg.src = "toppipe.png";

const pipeBottomImg = new Image();
pipeBottomImg.src = "bottompipe.png";

// ===== Game configuration =====
const GRAVITY = 0.4;
const FLAP_STRENGTH = -7;
const PIPE_SPEED_START = 2.2;
const PIPE_GAP_START = 140;
const PIPE_WIDTH = 70;
const PIPE_INTERVAL = 1600; // ms between pipes
const FLOOR_HEIGHT = 100; // collide before bottom edge

// ===== Game state =====
let gameState = "start"; // "start" | "running" | "gameover"
let bird;
let pipes;
let score;
let lastPipeTime;
let lastFrameTime;
let pipeSpeed;
let pipeGap;

// Bird factory
function createBird() {
  const birdWidth = 40;
  const birdHeight = 30;

  return {
    x: WIDTH * 0.27,
    y: HEIGHT / 2,
    width: birdWidth,
    height: birdHeight,
    vy: 0,
  };
}

function resetGame() {
  bird = createBird();
  pipes = [];
  score = 0;
  lastPipeTime = 0;
  lastFrameTime = 0;
  pipeSpeed = PIPE_SPEED_START;
  pipeGap = PIPE_GAP_START;
}

// ===== Input handling =====
function onUserFlap() {
  if (gameState === "start") {
    // Transition to running
    startScreen.classList.add("overlay--hidden");
    gameOverScreen.classList.add("overlay--hidden");
    resetGame();
    gameState = "running";
    bird.vy = FLAP_STRENGTH;
  } else if (gameState === "running") {
    bird.vy = FLAP_STRENGTH;
  } else if (gameState === "gameover") {
    // Restart game
    startScreen.classList.add("overlay--hidden");
    gameOverScreen.classList.add("overlay--hidden");
    resetGame();
    gameState = "running";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    onUserFlap();
  }
});

canvas.addEventListener("mousedown", onUserFlap);
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  onUserFlap();
});

// ===== Pipes =====
function spawnPipePair() {
  const minTop = 40;
  const maxTop = HEIGHT - FLOOR_HEIGHT - pipeGap - 40;
  const topHeight = Math.random() * (maxTop - minTop) + minTop;

  pipes.push({
    x: WIDTH + PIPE_WIDTH,
    topHeight,
    gap: pipeGap,
    width: PIPE_WIDTH,
    scored: false,
  });
}

function updatePipes(delta) {
  const dx = pipeSpeed * (delta / 16.67); // scale by frame time

  pipes.forEach((pipe) => {
    pipe.x -= dx;
  });

  // Remove pipes that moved off-screen
  pipes = pipes.filter((pipe) => pipe.x + pipe.width > -10);
}

// ===== Collision detection =====
function rectsOverlap(a, b) {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
}

function checkCollisions() {
  // Ground / ceiling
  if (bird.y + bird.height > HEIGHT - FLOOR_HEIGHT) {
    return true;
  }
  if (bird.y < 0) {
    return true;
  }

  // Pipes
  for (const pipe of pipes) {
    const topRect = {
      x: pipe.x,
      y: 0,
      width: pipe.width,
      height: pipe.topHeight,
    };

    const bottomRect = {
      x: pipe.x,
      y: pipe.topHeight + pipe.gap,
      width: pipe.width,
      height: HEIGHT - FLOOR_HEIGHT - (pipe.topHeight + pipe.gap),
    };

    const birdRect = {
      x: bird.x,
      y: bird.y,
      width: bird.width,
      height: bird.height,
    };

    if (rectsOverlap(birdRect, topRect) || rectsOverlap(birdRect, bottomRect)) {
      return true;
    }
  }

  return false;
}

// ===== Score & difficulty =====
function updateScore() {
  for (const pipe of pipes) {
    if (!pipe.scored && pipe.x + pipe.width < bird.x) {
      pipe.scored = true;
      score++;

      // Increase difficulty every 5 points
      if (score % 5 === 0) {
        pipeSpeed += 0.35;
        pipeGap = Math.max(100, pipeGap - 6);
      }
    }
  }
}

// ===== Drawing helpers =====
function drawBackground() {
  if (bgImg.complete) {
    // Tile background horizontally so we cover full width
    const patternWidth = bgImg.width;
    for (let x = 0; x < WIDTH + patternWidth; x += patternWidth) {
      ctx.drawImage(bgImg, x, 0, patternWidth, HEIGHT);
    }
  } else {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  // Simple ground rectangle (in front)
  ctx.fillStyle = "#ded895";
  ctx.fillRect(0, HEIGHT - FLOOR_HEIGHT, WIDTH, FLOOR_HEIGHT);

  ctx.fillStyle = "#7cba3b";
  ctx.fillRect(0, HEIGHT - FLOOR_HEIGHT, WIDTH, 24);
}

function drawPipes() {
  pipes.forEach((pipe) => {
    const topHeight = pipe.topHeight;
    const bottomY = pipe.topHeight + pipe.gap;
    const bottomHeight = HEIGHT - FLOOR_HEIGHT - bottomY;

    // Top pipe
    if (pipeTopImg.complete) {
      ctx.drawImage(
        pipeTopImg,
        pipe.x,
        topHeight - pipeTopImg.height,
        pipe.width,
        pipeTopImg.height
      );
    } else {
      ctx.fillStyle = "#3cb043";
      ctx.fillRect(pipe.x, 0, pipe.width, topHeight);
    }

    // Bottom pipe
    if (pipeBottomImg.complete) {
      ctx.drawImage(
        pipeBottomImg,
        pipe.x,
        bottomY,
        pipe.width,
        pipeBottomImg.height
      );
    } else {
      ctx.fillStyle = "#3cb043";
      ctx.fillRect(pipe.x, bottomY, pipe.width, bottomHeight);
    }
  });
}

function drawBird(timestamp) {
  ctx.save();
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);

  // Rotate based on velocity (little animation flair)
  const angle = Math.max(Math.min(bird.vy / 10, 0.6), -0.6);
  ctx.rotate(angle);

  if (birdImg.complete) {
    const flapOffset = Math.sin(timestamp / 120) * 3; // fake flap
    ctx.drawImage(
      birdImg,
      -bird.width / 2,
      -bird.height / 2 + flapOffset,
      bird.width,
      bird.height
    );
  } else {
    // Fallback: yellow rectangle
    ctx.fillStyle = "#ffd93b";
    ctx.fillRect(-bird.width / 2, -bird.height / 2, bird.width, bird.height);
  }

  ctx.restore();
}

function drawScore() {
  ctx.font = "32px system-ui";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.fillStyle = "#ffffff";

  const text = String(score);
  const w = ctx.measureText(text).width;

  ctx.strokeText(text, WIDTH / 2 - w / 2, 70);
  ctx.fillText(text, WIDTH / 2 - w / 2, 70);
}

// ===== Main game loop =====
function gameLoop(timestamp) {
  if (!lastFrameTime) lastFrameTime = timestamp;
  const delta = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  // Clear
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Background first
  drawBackground();

  if (gameState === "start") {
    // Little idle animation while waiting
    bird.y = HEIGHT / 2 + Math.sin(timestamp / 350) * 10;
    drawPipes();
    drawBird(timestamp);
    drawScore(); // shows 0
  } else if (gameState === "running") {
    // Physics
    bird.vy += GRAVITY;
    bird.y += bird.vy;

    // Pipes
    if (!lastPipeTime || timestamp - lastPipeTime > PIPE_INTERVAL) {
      spawnPipePair();
      lastPipeTime = timestamp;
    }
    updatePipes(delta);
    updateScore();

    // Draw
    drawPipes();
    drawBird(timestamp);
    drawScore();

    // Collisions
    if (checkCollisions()) {
      gameState = "gameover";
      finalScoreEl.textContent = `Your score: ${score}`;
      gameOverScreen.classList.remove("overlay--hidden");
    }
  } else if (gameState === "gameover") {
    drawPipes();
    drawBird(timestamp);
    drawScore();
  }

  requestAnimationFrame(gameLoop);
}

// ===== Start it up =====
resetGame();
requestAnimationFrame(gameLoop);
