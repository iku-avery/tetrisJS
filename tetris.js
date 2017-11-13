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

let dropCounter = 0;
dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        player.position.y++;
        dropCounter = 0;
    }
    // console.log(deltaTime);
    draw();
    requestAnimationFrame(update);
}

const player = {
    position: {x:5, y:5},
    matrix: matrix
};

update();