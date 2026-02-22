// Ensure proper event handling for touch devices
function openTab(event, tabName) {
    event.preventDefault(); // Prevent default link behavior
    // Add touchstart event listener for iPads
    if (event.type === 'touchstart') {
        console.log('Tab opened from touch event');
    } else {
        console.log('Tab opened from click event');
    }
    // Logic to open the specified tab
    //... (existing logic to manage tabs goes here)
}

// Adding touchstart event listeners
const tabLinks = document.querySelectorAll('.tablinks');
tabLinks.forEach(link => {
    link.addEventListener('click', (event) => openTab(event, link.getAttribute('data-tab')));
    link.addEventListener('touchstart', (event) => openTab(event, link.getAttribute('data-tab')));
});