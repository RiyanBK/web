const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');

// Set initial canvas size and context properties
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setContextDefaults();
}

// Set default context properties
function setContextDefaults() {
    ctx.strokeStyle = '#4A148C';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over'; // Ensure default composition
}

setCanvasSize();

// Storage functions with debug logging
function saveToStorage(data) {
    try {
        localStorage.setItem('savedDrawing', data);
        console.log('Drawing saved to localStorage');
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromStorage() {
    try {
        return localStorage.getItem('savedDrawing');
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Save drawing function with compression
function saveDrawing() {
    try {
        const drawingData = canvas.toDataURL('image/png'); // Using PNG for better quality
        
        // Check data size
        const dataSize = drawingData.length;
        console.log('Drawing data size:', Math.round(dataSize / 1024), 'KB');

        // Save to localStorage
        if (saveToStorage(drawingData)) {
            console.log('Drawing saved successfully');
        } else {
            console.error('Failed to save drawing');
        }
    } catch (error) {
        console.error('Error in saveDrawing:', error);
    }
}

// Load drawing function with debug
function loadDrawing() {
    try {
        const savedData = getFromStorage();
        if (savedData) {
            console.log('Found saved drawing, attempting to load...');
            const img = new Image();
            
            img.onload = function() {
                // Clear the canvas first
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Reset context properties
                setContextDefaults();
                
                // Create a temporary canvas to handle the drawing
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                
                // Draw the image onto the temporary canvas
                tempCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Draw the temporary canvas onto the main canvas
                ctx.drawImage(tempCanvas, 0, 0);
                
                console.log('Drawing loaded successfully');
            };
            
            img.onerror = function(error) {
                console.error('Error loading image:', error);
            };
            
            img.src = savedData;
        } else {
            console.log('No saved drawing found');
        }
    } catch (error) {
        console.error('Error in loadDrawing:', error);
    }
}

// Clear drawing and storage
function clearDrawing() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem('savedDrawing');
    setContextDefaults();
    console.log('Drawing and storage cleared');
}

// Add clear button
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear Drawing';
clearButton.style.position = 'fixed';
clearButton.style.top = '20px';
clearButton.style.right = '20px';
clearButton.style.zIndex = '1000';
clearButton.style.padding = '10px';
clearButton.style.backgroundColor = '#4A148C';
clearButton.style.color = 'white';
clearButton.style.border = 'none';
clearButton.style.borderRadius = '5px';
clearButton.style.cursor = 'pointer';
document.body.appendChild(clearButton);
clearButton.addEventListener('click', clearDrawing);

// Drawing event listeners
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
    if (isDrawing) {
        isDrawing = false;
        console.log('Drawing ended, saving...');
        saveDrawing();
    }
});

canvas.addEventListener('mouseout', () => {
    if (isDrawing) {
        isDrawing = false;
        console.log('Mouse left canvas, saving...');
        saveDrawing();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    console.log('Window resized, preserving drawing...');
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    
    setCanvasSize();
    
    ctx.drawImage(tempCanvas, 0, 0);
    saveDrawing(); // Save after resize
});

// Load saved drawing when page loads
window.addEventListener('load', () => {
    console.log('Page loaded, attempting to restore drawing...');
    loadDrawing();
});

// Auto-save every 30 seconds if there are changes
let lastSavedData = '';
setInterval(() => {
    const currentData = canvas.toDataURL('image/png');
    if (currentData !== lastSavedData) {
        console.log('Auto-saving drawing...');
        saveDrawing();
        lastSavedData = currentData;
    }
}, 30000);