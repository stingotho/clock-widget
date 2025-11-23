const { ipcRenderer } = require('electron');

const clockElement = document.getElementById('clock');
const clockContainer = document.getElementById('clock-container');
const settingsBtn = document.getElementById('settings-btn');

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();

// Open Settings
settingsBtn.addEventListener('click', () => {
    ipcRenderer.send('open-settings');
});

// Apply Settings
ipcRenderer.on('apply-settings', (event, settings) => {
    // Frame
    clockContainer.className = `clock-frame ${settings.frame}`;

    // Style
    clockElement.className = settings.style;

    // Text Color
    clockElement.style.color = settings.textColor;

    // Background Color (Custom handling for frames)
    // We'll apply it to the container's background, overriding CSS if needed
    clockContainer.style.background = settings.bgColor;
    // If transparent/glass, we might want to handle it differently, but direct override works for now.
});
