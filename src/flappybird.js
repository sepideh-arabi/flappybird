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

// Physics
let vy = 0; // vertical velocity (px/frame)
const GRAV = 0.45; // gravity strength (tweakable)
const JUMP = -7; // jump impulse (tweakable)

// ===== Pipes (static demo layout) =====
const pipeWidth = 64;
const pipeHeight = 512;
let topPipeImg, bottomPipeImg;

// ===== Boot =====
window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  // input: spacebar + click/tap
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") vy = JUMP;
  });
  board.addEventListener("pointerdown", () => {
    vy = JUMP;
  });

  // load sprites then start loop
  preloadSprites()
    .then(() => {
      requestAnimationFrame(update);
    })
    .catch((err) => {
      console.error("Sprite load error:", err);
      requestAnimationFrame(update); // still run with fallbacks
    });
};

// ---- preload helper (attach handlers before src) ----
function load(img, src) {
  return new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function preloadSprites() {
  birdImg = new Image();
  topPipeImg = new Image();
  bottomPipeImg = new Image();
  return Promise.all([
    load(birdImg, "./flappybird.png"),
    load(topPipeImg, "./toppipe.png"),
    load(bottomPipeImg, "./bottompipe.png"),
  ]);
}

// ---- drawing helpers ----
function drawBird() {
  if (birdImg && birdImg.complete) {
    context.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);
  } else {
    // fallback rectangle if image missing
    context.fillStyle = "green";
    context.fillRect(birdX, birdY, birdWidth, birdHeight);
  }
}

function drawPipes() {
  if (
    topPipeImg &&
    bottomPipeImg &&
    topPipeImg.complete &&
    bottomPipeImg.complete
  ) {
    // top pipes
    context.drawImage(topPipeImg, 0, 0, pipeWidth, pipeHeight);
    context.drawImage(topPipeImg, 80, 0, pipeWidth, pipeHeight / 2);
    context.drawImage(topPipeImg, 160, 0, pipeWidth, pipeHeight / 3);
    context.drawImage(topPipeImg, 240, 0, pipeWidth, pipeHeight / 4);
    // bottom pipes
    context.drawImage(bottomPipeImg, 0, 565, pipeWidth, pipeHeight / 4);
    context.drawImage(bottomPipeImg, 80, 425, pipeWidth, pipeHeight / 3);
    context.drawImage(bottomPipeImg, 160, 320, pipeWidth, pipeHeight / 2);
    context.drawImage(bottomPipeImg, 240, 215, pipeWidth, pipeHeight);
  }
}

// ---- main loop ----
function update() {
  context.clearRect(0, 0, boardWidth, boardHeight);

  // gravity + position
  vy += GRAV;
  birdY += vy;

  // clamp to ceiling/floor
  if (birdY < 0) {
    birdY = 0;
    vy = 0;
  }
  if (birdY > boardHeight - birdHeight) {
    birdY = boardHeight - birdHeight;
    vy = 0;
  }

  // draw order
  drawPipes();
  drawBird();

  requestAnimationFrame(update);
}
