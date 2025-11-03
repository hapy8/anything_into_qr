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
});

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