const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;

// Set the canvas size to the entire viewport
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

// Check if the event is inside the container
function isInContainer(x, y) {
    const container = document.querySelector('.container');
    const rect = container.getBoundingClientRect();
    return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
}

// Start drawing when the mouse is clicked outside the container
canvas.addEventListener('mousedown', (event) => {
    if (!isInContainer(event.clientX, event.clientY)) {
        drawing = true;
        draw(event);  // Start drawing immediately
    }
});

// Stop drawing when the mouse is released
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();  // Reset the path to avoid connected lines
});

// Continue drawing as the mouse moves
canvas.addEventListener('mousemove', (event) => {
    if (drawing) {
        draw(event);
    }
});

// Function to draw on the canvas
function draw(event) {
    if (!drawing) return;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4A148C';  // Same purple color as the text

    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
}

// Ensure the canvas resizes correctly on window resize
window.addEventListener('resize', resizeCanvas);
