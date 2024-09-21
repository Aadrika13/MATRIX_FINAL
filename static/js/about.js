let currentItem = 1; // Track the current item

document.querySelectorAll('.slider .item').forEach(item => {
    item.addEventListener('click', function() {
        const quantity = parseInt(getComputedStyle(document.querySelector('.slider')).getPropertyValue('--quantity'));
        const position = parseInt(this.style.getPropertyValue('--position'));
        const rotationAngle = 360 / quantity;
        const newRotation = (position - 1) * rotationAngle; // Clockwise rotation

        // Apply the rotation to the slider
        document.querySelector('.slider').style.transition = 'transform 1s ease-in-out'; // Ensure smooth transition
        document.querySelector('.slider').style.transform = `perspective(1000px) rotateY(${newRotation}deg)`;
        
        // Update the front item
        updateFrontItem(position, quantity);

        // Update the current item and reset if it's the last one
        currentItem = position;
        if (currentItem === quantity) {
            // Move back to the first item after the transition
            setTimeout(() => {
                document.querySelector('.slider').style.transition = 'transform 1s ease-in-out'; // Ensure smooth transition
                document.querySelector('.slider').style.transform = `perspective(1000px) rotateY(0deg)`;
                updateFrontItem(1, quantity);
                currentItem = 1; // Reset to first item
            }, 1000); // Delay to match the transition duration
        }
    });
});

function updateFrontItem(frontPosition, quantity) {
    document.querySelectorAll('.slider .item').forEach(item => {
        const position = parseInt(item.style.getPropertyValue('--position'));
        item.classList.remove('front');
        const infoCard = item.querySelector('.info-card');
        if (position === frontPosition) {
            item.classList.add('front');
            infoCard.style.opacity = '1'; // Show the info card for the front item
        } else {
            infoCard.style.opacity = '0'; // Hide the info card for non-front items
        }

        // Calculate the new position after the rotation
        const newPosition = (position - frontPosition + quantity) % quantity + 1;
        item.style.setProperty('--position', newPosition);
    });
}

// Set the first item as the front at the start
updateFrontItem(1, 6);
