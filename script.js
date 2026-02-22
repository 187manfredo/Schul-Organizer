// Load dark mode setting from localStorage
const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
}

// Save dark mode setting on toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Load notes from localStorage on startup
const notes = localStorage.getItem('notes') || '';
document.getElementById('notes').value = notes;

// Save notes to localStorage on change
document.getElementById('notes').addEventListener('input', (event) => {
    localStorage.setItem('notes', event.target.value);
});
