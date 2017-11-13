const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
var W = canvas.width;
var H = canvas.height;

context.scale(20, 20);
context.fillStyle = "#000";
context.fillRect(0, 0, W, H);

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

matrix.forEach((row, y) => {
    row.forEach((value, x) => {
        if (value !== 0) {
        context.fillStyle = "red";
        context.fillRect(x, y, 1, 1);
        }
    });
});

