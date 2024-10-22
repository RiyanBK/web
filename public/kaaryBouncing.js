document.addEventListener('click', (event) => {
    createBouncingImages(event.clientX, event.clientY);
});

function createBouncingImages(x, y) {
    const numberOfImages = 5; // Number of images to create per click
    for (let i = 0; i < numberOfImages; i++) {
        const img = document.createElement('img');
        img.src = 'kaary.png'; // Ensure this file is in the correct directory
        img.classList.add('bouncing-kaary');
        img.style.position = 'absolute';
        img.style.width = '20px'; // Tiny size
        img.style.height = '20px';
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        img.style.zIndex = '1000'; // Make sure it appears on top

        // Add image to the body
        document.body.appendChild(img);

        // Log the image creation (for debugging)
        console.log(`Added a bouncing Kaary image at ${x}px, ${y}px`);

        // Randomize the direction and speed of the bounce
        const randomX = (Math.random() - 0.5) * 300; // Horizontal bounce
        const randomY = (Math.random() - 0.5) * 300; // Vertical bounce
        const duration = 1000 + Math.random() * 1000; // Random duration

        // Animate the image
        img.animate([
            { transform: 'translate(0, 0)' },
            { transform: `translate(${randomX}px, ${randomY}px)` }
        ], {
            duration: duration,
            easing: 'ease-out',
            fill: 'forwards'
        });

        // Remove the image from the DOM after animation completes
        setTimeout(() => {
            img.remove();
            console.log('Removed a bouncing Kaary image.');
        }, duration);
    }
}
