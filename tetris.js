const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
let W = canvas.width;
let H = canvas.height;

context.scale(20, 20);

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function draw() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, W, H);
    drawMatrix(player.matrix, player.position);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = "red";
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function mergeGamePlayer(game, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                game[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.position.y++;
    dropCounter = 0;

}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    // console.log(deltaTime);
    draw();
    requestAnimationFrame(update);
}

const game = createMatrix(12, 20);
console.log(game); console.table(game);

const player = {
    position: {x:5, y:5},
    matrix: matrix
};

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        player.position.x--;
    } else if (event.keyCode === 39) {
        player.position.x++;
    } else if (event.keyCode === 40) {
        playerDrop();
    }
});



update();