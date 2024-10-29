const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
const database = firebase.database();

// User tracking
let currentUser = localStorage.getItem('username');
let strokeCount = 0;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set initial canvas size and context properties
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setContextDefaults();
}

function setContextDefaults() {
    ctx.strokeStyle = '#4A148C';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';
}

setCanvasSize();

// Storage functions for local drawing data
function saveToStorage(data) {
    try {
        localStorage.setItem('savedDrawing', data);
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

// Save drawing function
function saveDrawing() {
    try {
        const drawingData = canvas.toDataURL('image/png');
        saveToStorage(drawingData);
    } catch (error) {
        console.error('Error in saveDrawing:', error);
    }
}

// Load drawing function
function loadDrawing() {
    try {
        const savedData = getFromStorage();
        if (savedData) {
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setContextDefaults();
                ctx.drawImage(img, 0, 0);
            };
            img.src = savedData;
        }
    } catch (error) {
        console.error('Error in loadDrawing:', error);
    }
}

// Create modal for username input
function createUsernameModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        font-family: 'IM Fell English', serif;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    `;

    const title = document.createElement('h2');
    title.textContent = 'Enter Your Initials';
    title.style.cssText = `
        margin-bottom: 20px;
        color: #4A148C;
        font-family: 'IM Fell English', serif;
    `;

    const input = document.createElement('input');
    input.style.cssText = `
        padding: 10px;
        font-size: 16px;
        width: 100px;
        text-align: center;
        margin-bottom: 20px;
        border: 2px solid #4A148C;
        border-radius: 5px;
        text-transform: uppercase;
        font-family: 'IM Fell English', serif;
    `;
    input.maxLength = 3;

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Start Drawing';
    submitButton.style.cssText = `
        padding: 10px 20px;
        background-color: #4A148C;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'IM Fell English', serif;
    `;

    modalContent.appendChild(title);
    modalContent.appendChild(input);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(submitButton);
    modal.appendChild(modalContent);

    submitButton.addEventListener('click', () => {
        const username = input.value.toUpperCase();
        if (/^[A-Z]{3}$/.test(username)) {
            localStorage.setItem('username', username);
            currentUser = username;
            modal.remove();
            initializeUser();
            createLeaderboard();
            loadDrawing();
        } else {
            alert('Please enter exactly 3 letters');
        }
    });

    document.body.appendChild(modal);
    input.focus();
}

// Create leaderboard UI
function createLeaderboard() {
    if (document.getElementById('leaderboard')) return;

    const leaderboardDiv = document.createElement('div');
    leaderboardDiv.style.cssText = `
        position: fixed;
        top: 80px;
        left: 20px;
        background-color: rgba(74, 20, 140, 0.9);
        padding: 15px;
        border-radius: 10px;
        z-index: 1000;
        min-width: 200px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        font-family: 'IM Fell English', serif;
    `;
    leaderboardDiv.id = 'leaderboard';

    const title = document.createElement('h3');
    title.textContent = 'Top Artists';
    title.style.cssText = `
        margin-bottom: 10px;
        border-bottom: 2px solid white;
        padding-bottom: 5px;
        color: white;
        font-family: 'IM Fell English', serif;
    `;

    leaderboardDiv.appendChild(title);
    document.body.appendChild(leaderboardDiv);
    setupLeaderboardListener();
}

// Firebase Realtime Database functions
function setupLeaderboardListener() {
    const leaderboardRef = database.ref('leaderboard');
    leaderboardRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        updateLeaderboardDisplay(data);
    });
}

function updateLeaderboardDisplay(data) {
    const leaderboardDiv = document.getElementById('leaderboard');
    if (!leaderboardDiv) return;

    // Clear existing entries except title
    while (leaderboardDiv.children.length > 1) {
        leaderboardDiv.removeChild(leaderboardDiv.lastChild);
    }

    // Sort users by stroke count
    const sortedUsers = Object.entries(data)
        .sort(([,a], [,b]) => b.strokes - a.strokes)
        .slice(0, 5);

    sortedUsers.forEach(([username, userData], index) => {
        const entry = document.createElement('div');
        entry.style.cssText = `
            margin: 5px 0;
            color: ${username === currentUser ? '#FFD700' : '#B39DDB'};
            font-family: 'IM Fell English', serif;
        `;
        entry.textContent = `${index + 1}. ${username}: ${userData.strokes} strokes`;
        leaderboardDiv.appendChild(entry);
    });
}

// Initialize user data
function initializeUser() {
    if (currentUser) {
        const userRef = database.ref(`leaderboard/${currentUser}`);
        userRef.once('value').then((snapshot) => {
            if (snapshot.exists()) {
                strokeCount = snapshot.val().strokes;
            } else {
                strokeCount = 0;
                userRef.set({
                    username: currentUser,
                    strokes: strokeCount
                });
            }
            createLeaderboard();
        }).catch(error => {
            console.error("Error initializing user:", error);
            createLeaderboard();
        });
    }
}

// Update stroke count
function updateStrokeCount() {
    if (!currentUser) return;
    
    strokeCount++;
    database.ref(`leaderboard/${currentUser}`).set({
        username: currentUser,
        strokes: strokeCount
    }).catch(error => {
        console.error("Error updating stroke count:", error);
    });
}

// Drawing functions
function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

// Clear drawing
function clearDrawing() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setContextDefaults();
    localStorage.removeItem('savedDrawing');
}

// Add clear button
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear Drawing';
clearButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    padding: 10px;
    background-color: #4A148C;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'IM Fell English', serif;
`;
document.body.appendChild(clearButton);
clearButton.addEventListener('click', clearDrawing);

// Event Listeners
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getMousePos(canvas, e);
    lastX = pos.x;
    lastY = pos.y;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    updateStrokeCount();
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
        saveDrawing();
    }
});

canvas.addEventListener('mouseout', () => {
    if (isDrawing) {
        isDrawing = false;
        saveDrawing();
    }
});

window.addEventListener('resize', () => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    
    setCanvasSize();
    
    ctx.drawImage(tempCanvas, 0, 0);
    saveDrawing();
});

// Initial setup
window.addEventListener('load', () => {
    if (!currentUser) {
        createUsernameModal();
    } else {
        initializeUser();
        createLeaderboard();
        loadDrawing();
    }
});