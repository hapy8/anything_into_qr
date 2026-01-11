import http.server
import socketserver
import socket
import threading

PORT = 0  # Use 0 to let the OS assign a random available port

# Change to the directory where the script is located
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for better compatibility
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Reduce logging verbosity to improve performance
        if "GET /" in format and ("200" in format or "304" in format):
            return  # Suppress successful GET requests
        super().log_message(format, *args)

Handler = CustomHTTPRequestHandler

# Create the server with port 0 to get a random available port
httpd = socketserver.ThreadingTCPServer(("0.0.0.0", PORT), Handler, bind_and_activate=False)
httpd.allow_reuse_address = True
httpd.server_bind()
httpd.server_activate()
PORT = httpd.server_address[1]  # Get the actual assigned port

with httpd:
    # Get the network IP address
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
    except:
        local_ip = "Unable to determine network IP"

    print(f"Server started successfully!")
    print(f"Access locally at: http://localhost:{PORT}")
    print(f"Access from other devices on the same network at: http://{local_ip}:{PORT}")
    print("Press Ctrl+C to stop the server.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")