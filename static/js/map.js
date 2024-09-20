// map.js

let map;
function initMap() {
    // Center map on a default location
    const defaultLocation = { lat: 51.505, lng: -0.09 }; // Change this to your preferred default location
    map = L.map('map').setView(defaultLocation, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            // Update map center
            map.setView(pos, 15);

            // Add a marker at the user's location
            L.marker(pos).addTo(map).bindPopup('You are here!').openPopup();

            // Autofill address
            document.getElementById("address").value = `Latitude: ${pos.lat}, Longitude: ${pos.lng}`;
        }, () => {
            handleLocationError(true, map.getCenter());
        });
    } else {
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    alert(browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.");
}

// Initialize the map on window load
window.onload = initMap;
