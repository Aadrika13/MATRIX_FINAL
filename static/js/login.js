let lastInputTime = 0;
let characterCount = 0;
let typingTimer;
const typingInterval = 2000; // Check typing speed every second
const maxSpeed = 100; // Max speed in letters per minute

// Check if the browser supports geolocation and autofill the address field
function getLocation() {
    if (navigator.geolocation) {
        console.log("Geolocation supported by browser."); // Debugging log
        navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Set the latitude and longitude in the address field
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    document.getElementById("address").value = `Latitude: ${latitude}, Longitude: ${longitude}`;
    console.log("Geolocation successful. Address field updated."); // Debugging log
}

// Handle geolocation errors
function handleError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Calculate typing speed and check address
function calculateSpeed() {
    const now = Date.now();
    const timeDiff = (now - lastInputTime) / 1000; // Time in seconds
    const speed = (characterCount / timeDiff) * 60; // Speed in letters per minute

    const addressFilled = document.getElementById("address").value.trim() !== '';
    
    if (speed > maxSpeed || !addressFilled) {
        document.getElementById("loginButton").disabled = true;
        document.getElementById("botDetected").style.display = "block"; // Show bot detected message
    } else {
        document.getElementById("loginButton").disabled = false; // Enable button if criteria met
        document.getElementById("botDetected").style.display = "none"; // Hide bot detected message
    }
}

// Update character count and last input time
function updateTyping() {
    const usernameLength = document.getElementById("username").value.length;
    const passwordLength = document.getElementById("password").value.length;
    characterCount = usernameLength + passwordLength; // Update character count
    lastInputTime = Date.now(); // Update last input time
    clearTimeout(typingTimer); // Clear existing timer

    typingTimer = setTimeout(calculateSpeed, typingInterval); // Set new timer
    checkAddress(); // Check address field whenever typing occurs
}

// Check address field on input
function checkAddress() {
    const addressFilled = document.getElementById("address").value.trim() !== '';
    document.getElementById("loginButton").disabled = !addressFilled; // Disable button if address is empty
}

// Run the getLocation function when the window loads
window.onload = function() {
    getLocation(); // Call geolocation when the window loads
    document.getElementById("username").addEventListener("input", updateTyping);
    document.getElementById("password").addEventListener("input", updateTyping);
    document.getElementById("address").addEventListener("input", checkAddress);
};
