const { ipcRenderer } = require('electron');

const frameSelect = document.getElementById('frame-select');
const styleSelect = document.getElementById('style-select');
const textColorPicker = document.getElementById('text-color-picker');
const bgColorPicker = document.getElementById('bg-color-picker');
const alwaysOnTopCheckbox = document.getElementById('always-on-top');
const closeBtn = document.getElementById('close-btn');

// Initialize values (could be requested from main process if we stored state there)
// For now, we rely on defaults or user re-selecting.

function sendUpdate() {
    const settings = {
        frame: frameSelect.value,
        style: styleSelect.value,
        textColor: textColorPicker.value,
        bgColor: bgColorPicker.value,
        alwaysOnTop: alwaysOnTopCheckbox.checked
    };
    ipcRenderer.send('update-settings', settings);
}

frameSelect.addEventListener('change', sendUpdate);
styleSelect.addEventListener('change', sendUpdate);
textColorPicker.addEventListener('input', sendUpdate);
bgColorPicker.addEventListener('input', sendUpdate);
alwaysOnTopCheckbox.addEventListener('change', sendUpdate);

closeBtn.addEventListener('click', () => {
    window.close();
});
