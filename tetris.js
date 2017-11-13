const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
var W = canvas.width;
var H = canvas.height;

context.fillStyle = "#000";
context.fillRect(0, 0, W, H);