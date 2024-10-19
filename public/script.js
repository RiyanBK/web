const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set the drawing color
const drawingColor = '#4A148C'; // Dark purple

let isDrawing = false;

// Start drawing
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
});

// Draw on the canvas
canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        ctx.lineTo(e.clientX, e.clientY);
        ctx.strokeStyle = drawingColor; // Set the stroke color
        ctx.lineWidth = 5; // Set the line width
        ctx.stroke();
    }
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.closePath();
});

// Clear the canvas when the mouse leaves
canvas.addEventListener('mouseout', () => {
    isDrawing = false;
    ctx.closePath();
});

// Resize the canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = '#E8EAF6'; // Reset the background color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with the background color
});
