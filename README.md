# Coordinates to QR Code

A simple web application that allows users to input latitude and longitude coordinates and generates a QR code. Scanning the QR code opens the corresponding location in Google Maps.

## Features

- Input validation for latitude (-90 to 90) and longitude (-180 to 180)
- Generates QR code using the QRCode.js library
- Responsive design with clean, modern UI inspired by Apple
- Dark mode toggle with smooth transitions and persistent preference
- No server-side dependencies; runs entirely in the browser (except for serving files)

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **QR Code Generation**: QRCode.js (served locally)
- **Server**: Python's built-in `http.server` module for local hosting

## How to Run

1. Ensure you have Python installed (version 3.x recommended).
2. Navigate to the project directory in your terminal.
3. Run the server:
   ```
   python run_server.py
   ```
4. The server will start and display the local URL (e.g., `http://localhost:PORT`) and network URL (e.g., `http://IP:PORT`).
5. Open the provided URL in your web browser.

The application is now running. You can access it from the same device or other devices on the same network.

## Usage

1. Enter the latitude and longitude coordinates in the respective input fields.
2. Click the "Generate QR Code" button.
3. A QR code will be displayed below the form.
4. Scan the QR code with a QR code reader app to open the location in Google Maps.
5. Toggle between light and dark mode using the button in the top right corner of the container.

## Files

- `index.html`: Main HTML structure
- `styles.css`: Styling for the application
- `script.js`: JavaScript logic for form handling and QR code generation
- `run_server.py`: Python script to start a local HTTP server

## Notes

- The server assigns a random available port each time it starts.
- The QR code links directly to Google Maps with the specified coordinates.
- No external dependencies are required beyond Python and a web browser.