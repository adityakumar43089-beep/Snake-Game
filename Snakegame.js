const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const scoreElement = document.querySelector("#score");
const highScoreElement = document.getElementById("high-score");
const timeElement = document.querySelector("#time");

const blockHeight = 50;
const blockwidth = 50;
let highScore = Number(localStorage.getItem("highScore")) || 0;
let score = 0;
let time = '00-00'

highScoreElement.innerHTML = highScore;

const rows = Math.floor(board.clientHeight / blockHeight)
const coloums = Math.floor(board.clientWidth / blockwidth)
let IntervalId = null;
let timerIntervalId = null;
let food = {x: Math.floor(Math.random() * rows) , y: Math.floor(Math.random() * coloums)}

const blocks = [];

let snake =[{
    x : 1,y : 3}];

    let direction ="right" ;


for(let row = 0; row<rows ; row++){
    for(let coloum = 0; coloum<coloums ; coloum++){
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText = ` ${row} - ${coloum}`; 
        blocks[`${row} - ${coloum}`] = block;
    }
}


function render() {
    let head = null;
    blocks[`${food.x} - ${food.y}`].classList.add("food");
    for(let i = 0 ;  i<1000 ; i++){
          
    }

    if(direction === "left"){
        head = {
            x : snake[0].x,
            y : snake[0].y - 1,
        }
    }
    else if(direction === "right"){
        head = {
            x : snake[0].x,
            y : snake[0].y + 1,
        }
    }
    else if(direction === "down"){
        head = {
            x : snake[0].x + 1,
            y : snake[0].y,
        }
    }
    else if(direction === "up"){
        head = {
            x : snake[0].x - 1,
            y : snake[0].y,
        }
    }

    // wall crash logic

    if(head.x <0 || head.x >= rows || head.y <0 || head.y >= coloums){ 
        clearInterval(IntervalId); // it's for the boundary touch out and then 
        modal.style.display = "flex"; // it make new display
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex"; // Understood hain

        return;
    }

    // food consume logic

    if(head.x == food.x && head.y == food.y){
        blocks[`${food.x} - ${food.y}`].classList.remove("food");
        food = {x: Math.floor(Math.random() * rows) , y: Math.floor(Math.random() * coloums)}
        blocks[`${food.x} - ${food.y}`].classList.add("food");
        snake.unshift(head); // Sanke get extendes , eating the food
        score +=10;
        scoreElement.innerHTML = score;
        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreElement.innerHTML = highScore; // update the screen too
        }
    }

    snake.forEach(segment => { // This part erases the snake from the screen before it moves, so the old picture doesn’t stay behind.
        const key = `${segment.x} - ${segment.y}`;
        blocks[key].classList.remove("fill");
    })

    snake.unshift(head); // Add the new head from the front 
    snake.pop(); // Remove the tail from the back
    snake.forEach(segment => { // color every square the snake now covers
        const key = `${segment.x} - ${segment.y}`;
        blocks[key].classList.add("fill");
    })
}



startButton.addEventListener("click" , () =>{
    modal.style.display = "none";
    IntervalId = setInterval(() =>{render()},150)
    timerIntervalId = setInterval(()=>{
        let[min,sec] = time.split("-").map(Number) // Destructuring
        if(sec == 59){
            min += 1
            sec = 0
        }else{
            sec += 1;
        }

        time = `${min}-${sec}`
        timeElement.innerText = time;
    },1000)
})

restartButton.addEventListener("click", restartGame)

function restartGame() {
    clearInterval(IntervalId); // stop the game for new game 

    blocks[`${food.x} - ${food.y}`].classList.remove("food");// remove the previous game snake and colour
    snake.forEach(seg =>{
        blocks[`${seg.x} - ${seg.y}`].classList.remove("fill");
    })
    score = 0
    time = '00-00'

    scoreElement.innerText = score
    timeElement.innerText = time
    highScoreElement.innerText = highScore 

    modal.style.display = "none"
    direction = "down";
    snake =[ {x : 1, y : 3} ]
    food = {x: Math.floor(Math.random() * rows) , y: Math.floor(Math.random() * coloums)}
    IntervalId = setInterval(() =>{ render() },150)

}


addEventListener("keydown" , (event)=>{
    if(event.key == "ArrowUp"){
        direction = "up";
    }
    if(event.key == "ArrowDown"){
        direction = "down";
    }
    if(event.key == "ArrowLeft"){
        direction = "left";
    }
    if(event.key == "ArrowRight"){
        direction = "right";
    }
})

