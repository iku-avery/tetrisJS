const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
let W = canvas.width;
let H = canvas.height;

context.scale(20, 20);

function sweepBoard() {
    let rowCounter = 1;
    outer: for(let y = game.length - 1; y > 0; --y) {
        for(let x = 0; x < game[y].length; ++x) {
            if(game[y][x] === 0) {
                continue outer;
            }
        }

        const row = game.splice(y, 1)[0].fill(0);
        game.unshift(row);
        ++y;

        player.score += rowCounter * 10;
        rowCounter *= 2;
    }
    
}

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

function createBlocks(type) {
    if (type === "T") {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0]
        ];
    } else if (type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0]
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ];
    }
    
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
                context.fillStyle = colors[value];
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
        playerReset();
        sweepBoard();
        updateScores();
        // player.position.y = 0;
    }
    dropCounter = 0;

}

function playerMove(direction) {
    player.position.x += direction;
    if (collide(game, player)) {
        player.position.x -= direction;
    }
}

function playerReset() {
    const blocks = 'ILJOTSZ';
    player.matrix = createBlocks(blocks[blocks.length * Math.random() | 0]);
    player.position.y = 0;
    player.position.x = (game[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(game, player)) {
        game.forEach(row => row.fill(0));
        player.score = 0;
        updateScores();
    }

    
}

function playerRotate(direction) {
    const position = player.position.x;
    let offset = 1;
    rotate(player.matrix, direction);
    while (collide(game, player)) {
        // console.log("dupa");
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


function updateScores() {
    document.getElementById('score').innerText = player.score;

}

const colors = [
    null,
    '#D81B60',
    '#00897B',
    '#00BCD4',
    '#558B2F',
    '#FFC107',
    '#E65100',
    '#E53935'
];

const game = createMatrix(12, 20);
console.log(game); console.table(game);

const player = {
    position: {x:0, y:0},
    matrix: null,
    score: 0,
};

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});


playerReset();
updateScores();
update();