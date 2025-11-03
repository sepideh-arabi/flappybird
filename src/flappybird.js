// ===== Canvas =====
let board, context;
const boardWidth = 360;
const boardHeight = 640;

// ===== Bird =====
const birdWidth = 34; // ~17:12 aspect
const birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

// ===== Physics =====
let vy = 0; // vertical velocity (px/frame)
const GRAV = 0.45; // gravity strength (tweakable)
const JUMP = -7; // jump impulse (tweakable)
const MAX_FALL = 12; // optional fall speed clamp

// ===== Game State =====
const STATE = { RUNNING: "RUNNING", GAME_OVER: "GAME_OVER" };
let gameState = STATE.RUNNING;

// (Pipes removed from rendering per homework)
// const pipeWidth = 64;
// const pipeHeight = 512;
// let topPipeImg, bottomPipeImg;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  // input: spacebar + click/tap + R to restart
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault(); // stop page scroll
      if (gameState === STATE.RUNNING) flap();
      else resetGame();
    }
    if (e.code === "KeyR") resetGame();
  });

  board.addEventListener("pointerdown", () => {
    if (gameState === STATE.RUNNING) flap();
    else resetGame();
  });

  // load bird sprite then start loop (simple, no pipes)
  preloadBird().finally(() => requestAnimationFrame(update));
};

// ---- preload helper (attach handlers before src) ----
function preloadBird() {
  return new Promise((res, rej) => {
    birdImg = new Image();
    birdImg.onload = res;
    birdImg.onerror = () => rej(new Error("Failed to load flappybird.png"));
    birdImg.src = "./flappybird.png";
  });
}

// ---- actions ----
function flap() {
  vy = JUMP; // negative velocity = up
}

function gameOver() {
  gameState = STATE.GAME_OVER;
}

function resetGame() {
  birdY = boardHeight / 2;
  vy = 0;
  gameState = STATE.RUNNING;
}

// ---- main loop ----
function update() {
  context.clearRect(0, 0, boardWidth, boardHeight);

  if (gameState === STATE.RUNNING) {
    // gravity + position
    vy += GRAV;
    if (vy > MAX_FALL) vy = MAX_FALL;
    birdY += vy;

    // clamp to ceiling/floor -> GAME_OVER
    if (birdY < 0) {
      birdY = 0;
      gameOver();
    }
    if (birdY > boardHeight - birdHeight) {
      birdY = boardHeight - birdHeight;
      gameOver();
    }
  }

  // draw order (pipes intentionally hidden this week)
  drawBird();

  if (gameState === STATE.GAME_OVER) drawGameOverText();

  requestAnimationFrame(update);
}

// ---- rendering ----
function drawBird() {
  if (birdImg && birdImg.complete) {
    context.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);
  } else {
    // fallback rectangle if image missing
    context.fillStyle = "green";
    context.fillRect(birdX, birdY, birdWidth, birdHeight);
  }
}

function drawGameOverText() {
  context.fillStyle = "black";
  context.font = "bold 24px sans-serif";
  context.textAlign = "center";
  context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 10);
  context.font = "16px sans-serif";
  context.fillText(
    "Press SPACE / click / R to restart",
    boardWidth / 2,
    boardHeight / 2 + 20
  );
}
