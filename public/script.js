const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');

// Set initial canvas size
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Reset context properties after resize
    ctx.strokeStyle = '#4A148C';  // Restored original purple color
    ctx.lineWidth = 5;  // Restored thicker line
    ctx.lineCap = 'round';  // Added for smoother lines
    ctx.lineJoin = 'round';  // Added for smoother lines
}

setCanvasSize();

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getMousePos(canvas, e);
    lastX = pos.x;
    lastY = pos.y;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(canvas, e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastX = pos.x;
    lastY = pos.y;
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

// Handle window resize
window.addEventListener('resize', setCanvasSize);