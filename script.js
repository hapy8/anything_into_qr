document.getElementById('text-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const inputText = document.getElementById('text-input').value.trim();

    if (!inputText) {
        alert('Please enter some text.');
        return;
    }

    // Check if input is coordinates (lat, lng format)
    const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    const match = inputText.match(coordRegex);

    let qrText;
    let qrMessage;

    if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[3]);

        // Validate coordinates
        if (lat < -90 || lat > 90) {
            alert('Latitude must be between -90 and 90.');
            return;
        }

        if (lng < -180 || lng > 180) {
            alert('Longitude must be between -180 and 180.');
            return;
        }

        // Create Google Maps URL
        qrText = `https://www.google.com/maps?q=${lat},${lng}`;
        qrMessage = 'Scan this QR code to view the location on Google Maps.';
    } else {
        // Treat as plain text
        qrText = inputText;
        qrMessage = 'Scan this QR code to view the text.';
    }

    // Clear previous QR code
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';

    // QR codes must have high contrast for scannability - always use black on white
    const qrDark = '#000000';
    const qrLight = '#ffffff';

    // Generate new QR code
    new QRCode(qrContainer, {
        text: qrText,
        width: 256,
        height: 256,
        colorDark: qrDark,
        colorLight: qrLight,
        correctLevel: QRCode.CorrectLevel.H
    });

    // Show QR container with animation
    document.getElementById('qr-container').classList.add('show');
    document.getElementById('qr-text').textContent = qrMessage;
    // The scan instruction is always visible when QR container is shown
});

// PWA Installation
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

// Check if app is already installed
async function checkIfInstalled() {
    if ('getInstalledRelatedApps' in navigator) {
        try {
            const relatedApps = await navigator.getInstalledRelatedApps();
            return relatedApps.some(app => app.url === window.location.origin);
        } catch (error) {
            console.log('Error checking installation status:', error);
        }
    }
    return false;
}

// Show install button only if not already installed
async function showInstallButton() {
    const isInstalled = await checkIfInstalled();
    if (!isInstalled) {
        installBtn.style.display = 'block';
    }
}

showInstallButton();

installBtn.addEventListener('click', async () => {
    // Check if we have a deferred prompt (Chrome/Android)
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            installBtn.style.display = 'none';
        }
        deferredPrompt = null;
    } else {
        // Check if already installed
        if ('getInstalledRelatedApps' in navigator) {
            const relatedApps = await navigator.getInstalledRelatedApps();
            const isInstalled = relatedApps.some(app => app.url === window.location.origin);
            if (isInstalled) {
                alert('App is already installed!');
                installBtn.style.display = 'none';
                return;
            }
        }

        // Fallback for browsers that don't support beforeinstallprompt
        // For iOS Safari and other browsers, show instructions
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            alert('To install: Tap the share button (📤) and select "Add to Home Screen"');
        } else if (/Android/.test(navigator.userAgent)) {
            alert('To install: Tap the menu (⋮) and select "Add to Home screen" or "Install app"');
        } else {
            alert('To install this app, use your browser\'s "Add to Home Screen" or "Install" option from the address bar or menu.');
        }
    }
});

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    deferredPrompt = null;
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
                registration.update(); // Force update check
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// Offline detection
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    console.log(isOnline ? 'Back online' : 'You are offline');

    // You could add visual indicators here if needed
    // For example, show/hide an offline message
}

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});