// Drawing on the canvas
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set drawing color to match the text color
ctx.strokeStyle = '#4B0082';
ctx.lineWidth = 5;

let isDrawing = false;

canvas.addEventListener('mousedown', () => {
    isDrawing = true;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', (event) => {
    if (isDrawing) {
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.closePath();
});

// Adjust canvas size when window resizes
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
