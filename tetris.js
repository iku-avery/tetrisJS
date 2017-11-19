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

function collide(game, player) {
    const m = player.matrix;
    const o = player.position;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (game[y + o.y] &&
                    game[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

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
    drawMatrix(game, {x: 0, y: 0});
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

function merge(game, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                game[y + player.position.y][x + player.position.x] = value;
            }
        });
    });
}

function playerDrop() {

    player.position.y++;
    if (collide(game, player)) {
        console.log("new blocks please");
        player.position.y--;
        console.log(player.position);
        merge(game, player);
        player.position.y = 0;
    }
    dropCounter = 0;

}

function playerMove(direction) {
    player.position.x += direction;
    if (collide(game, player)) {
        player.position.x -= direction;
    }
}

function playerRotate(direction) {
    const position = player.position.x;
    let offset = 1;
    rotate(player.matrix, direction);
    while (collide(game, player)) {
        // console.log("do this");
        player.position.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -direction);
            player.position.x = position;
            return;
        }

    }

}

function rotate(matrix, direction) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y]
            ];
        }
    }

    if (direction > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }

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
        playerMove(-1);
        // player.position.x--;
    } else if (event.keyCode === 39) {
        playerMove(1);
        // player.position.x++;
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});



update();