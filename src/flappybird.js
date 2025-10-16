//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

//pipes
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on the board

  //draw flappy bird
  context.fillStyle = "green";
  context.fillRect(birdX, birdY, birdWidth, birdHeight);

  //load images
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";
  topPipeImg.onload = function () {
    context.drawImage(topPipeImg, 0, 0, pipeWidth, pipeHeight);
    context.drawImage(topPipeImg, 80, 0, pipeWidth, pipeHeight / 2);
    context.drawImage(topPipeImg, 160, 0, pipeWidth, pipeHeight / 3);
    context.drawImage(topPipeImg, 240, 0, pipeWidth, pipeHeight / 4);
  };

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";
  bottomPipeImg.onload = function () {
    context.drawImage(bottomPipeImg, 0, 565, pipeWidth, pipeHeight / 4);
    context.drawImage(bottomPipeImg, 80, 425, pipeWidth, pipeHeight / 3);
    context.drawImage(bottomPipeImg, 160, 320, pipeWidth, pipeHeight / 2);
    context.drawImage(bottomPipeImg, 240, 215, pipeWidth, pipeHeight);
  };

  const orderFood = (restaurantName, foodAmount, foodName) => {
    console.log(
      "You are ordering " +
        foodAmount +
        " of " +
        foodName +
        " from " +
        restaurantName
    );
  };
};
