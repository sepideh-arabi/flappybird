console.log("script loaded");

// ===== Board =====
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// ===== Bird =====
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

// ===== Pipes =====
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth - pipeWidth / 2;
let pipeGap = 140;
let openingY = boardHeight / 2;

let topPipeImg;
let bottomPipeImg;

window.onload = function () {
  console.log("window onload fired");

  // Canvas setup
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  // Light sanity wash so you can see the canvas bounds
  context.fillStyle = "rgba(0,0,0,0.05)";
  context.fillRect(0, 0, boardWidth, boardHeight);

  // Load images, then draw
  loadSprites()
    .then(drawScene)
    .catch((err) => {
      console.error("Sprite load error:", err);
      drawFallback();
    });
};

// ---- robust image loader (set handlers before src) ----
function imgOnLoad(img, src) {
  return new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src; // set src last
  });
}

function loadSprites() {
  birdImg = new Image();
  topPipeImg = new Image();
  bottomPipeImg = new Image();

  return Promise.all([
    imgOnLoad(birdImg, "./flappybird.png"),
    imgOnLoad(topPipeImg, "./toppipe.png"),
    imgOnLoad(bottomPipeImg, "./bottompipe.png"),
  ]);
}

// ---- draw once ----
function drawScene() {
  console.log("drawScene()");
  context.clearRect(0, 0, boardWidth, boardHeight);

  // Bird
  context.drawImage(
    birdImg,
    birdX,
    birdY - birdHeight / 2,
    birdWidth,
    birdHeight
  );

  // Pipes
  const topPipeY = openingY - pipeGap / 2 - pipeHeight;
  const bottomPipeY = openingY + pipeGap / 2;

  context.drawImage(topPipeImg, pipeX, topPipeY, pipeWidth, pipeHeight);
  context.drawImage(bottomPipeImg, pipeX, bottomPipeY, pipeWidth, pipeHeight);

  // Tiny marker so you can tell the draw ran
  context.fillStyle = "#000";
  context.fillText("drawing!", 10, 20);
}

// ---- fallback rectangles if sprites fail ----
function drawFallback() {
  context.clearRect(0, 0, boardWidth, boardHeight);

  // Bird
  context.fillStyle = "green";
  context.fillRect(birdX, birdY - birdHeight / 2, birdWidth, birdHeight);

  // Pipes
  context.fillStyle = "darkgreen";
  const topPipeY = openingY - pipeGap / 2 - pipeHeight;
  const bottomPipeY = openingY + pipeGap / 2;
  context.fillRect(pipeX, topPipeY, pipeWidth, pipeHeight);
  context.fillRect(pipeX, bottomPipeY, pipeWidth, pipeHeight);
}
