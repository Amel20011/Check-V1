import http from "http";
import fs from "fs-extra";
import path from "path";
import { BOT } from "../config.js";

export async function startServer(getSock, { host, port }) {
  const server = http.createServer(async (req, res) => {
    // Set CORS headers for all requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    // Parse URL and query parameters
    const parsedUrl = new URL(req.url, `http://${host}:${port}`);
    const pathname = parsedUrl.pathname;

    try {
      // Main pairing endpoint with enhanced multi-device support
      if (req.method === "POST" && pathname === "/pair") {
        let body = "";
        req.on("data", (chunk) => body += chunk);
        req.on("end", async () => {
          try {
            const data = JSON.parse(body || "{}");
            const phone = (data.phone || "").replace(/\D/g, "");

            if (!phone) {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({
                ok: false,
                error: "Missing 'phone' (e.g. 62895800508215)",
                example: { phone: "62895800508215" }
              }));
            }

            const sock = getSock();
            if (!sock?.requestPairingCode) {
              res.writeHead(503, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({
                ok: false,
                error: "Pairing not ready - please wait for QR code or restart bot"
              }));
            }

            console.log(`🔗 Requesting pairing code for ${phone}...`);
            const code = await sock.requestPairingCode(phone);

            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({
              ok: true,
              code,
              phone,
              instructions: "Open WhatsApp > Linked Devices > Link a device > Enter this code",
              multiDevice: true,
              botName: BOT.name
            }));

          } catch (e) {
            console.error("❌ Pairing error:", e.message);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
              ok: false,
              error: e.message,
              hint: "Make sure phone number is valid and bot is ready"
            }));
          }
        });
        return;
      }

      // Get connection status
      if (req.method === "GET" && pathname === "/status") {
        const sock = getSock();
        const status = {
          connected: !!sock?.user,
          botName: BOT.name,
          version: "2.0.0",
          multiDevice: true,
          user: sock?.user ? {
            id: sock.user.id,
            name: sock.user.name || sock.user.verifiedName || "Unknown"
          } : null,
          timestamp: new Date().toISOString()
        };

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(status));
        return;
      }

      // Get QR code image if available
      if (req.method === "GET" && pathname === "/qr") {
        const sock = getSock();
        if (!sock || !sock.ws) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            ok: false,
            error: "QR code not available - connection already established"
          }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          ok: true,
          message: "Check terminal for QR code or use /pair endpoint for pairing code",
          pairingEndpoint: "/pair",
          instructions: "Send POST to /pair with phone number to get pairing code"
        }));
        return;
      }

      // Serve simple HTML interface for easy pairing
      if (req.method === "GET" && pathname === "/") {
        const html = generatePairingHTML();
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
        return;
      }

      // Health check endpoint
      if (req.method === "GET" && pathname === "/health") {
        const sock = getSock();
        const isHealthy = !!sock?.user;

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          status: isHealthy ? "healthy" : "unhealthy",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          connected: isHealthy
        }));
        return;
      }

      // API documentation endpoint
      if (req.method === "GET" && pathname === "/api") {
        const apiDoc = {
          title: `${BOT.name} WhatsApp Bot API`,
          version: "2.0.0",
          multiDevice: true,
          endpoints: {
            "POST /pair": {
              description: "Get pairing code for WhatsApp multi-device connection",
              body: { phone: "62895800508215" },
              response: { ok: true, code: "ABC123-DEF456" }
            },
            "GET /status": {
              description: "Get connection status",
              response: { connected: true, botName: "Liviaa🌷" }
            },
            "GET /qr": {
              description: "QR code information",
              response: { ok: true, message: "QR instructions" }
            },
            "GET /health": {
              description: "Health check",
              response: { status: "healthy" }
            }
          }
        };

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(apiDoc, null, 2));
        return;
      }

      // 404 for unknown endpoints
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        ok: false,
        error: "Endpoint not found",
        availableEndpoints: [
          "GET  /        - Pairing interface",
          "POST /pair    - Get pairing code",
          "GET  /status  - Connection status",
          "GET  /qr      - QR code info",
          "GET  /health  - Health check",
          "GET  /api     - API documentation"
        ]
      }));

    } catch (error) {
      console.error("❌ Server error:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        ok: false,
        error: "Internal server error"
      }));
    }
  });

  // Handle server errors
  server.on("error", (error) => {
    console.error("❌ Server error:", error);
  });

  await new Promise((resolve) => server.listen(port, host, resolve));
  console.log(`✅ ${BOT.name} Multi-device server listening at http://${host}:${port}`);
  console.log(`🔗 Pairing interface: http://${host}:${port}/`);
  console.log(`📱 Use /pair endpoint or scan QR code in terminal`);
}

function generatePairingHTML() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${BOT.name} - WhatsApp Multi-device Bot</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            max-width: 500px;
            width: 90%;
            text-align: center;
        }
        .logo { font-size: 3rem; margin-bottom: 1rem; }
        h1 { color: #667eea; margin-bottom: 0.5rem; font-size: 2rem; }
        .subtitle { color: #666; margin-bottom: 2rem; }
        .form-group {
            margin-bottom: 1.5rem;
            text-align: left;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }
        input {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3); }
        .btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        .result {
            margin-top: 2rem;
            padding: 1rem;
            border-radius: 10px;
            font-family: monospace;
            font-weight: bold;
        }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info {
            background: #e7f3ff;
            color: #0c5460;
            border: 1px solid #bee5eb;
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 10px;
            font-size: 0.9rem;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #e0e0e0;
        }
        .feature {
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }
        .feature-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
        @media (max-width: 480px) {
            .container { padding: 1.5rem; }
            h1 { font-size: 1.5rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌷</div>
        <h1>${BOT.name}</h1>
        <p class="subtitle">WhatsApp Multi-device Bot</p>

        <div class="info">
            📱 <strong>Multi-device Enabled:</strong> This bot works across multiple devices simultaneously!
            <br><br>
            You can scan the QR code in terminal OR use the pairing code method below.
        </div>

        <form id="pairForm">
            <div class="form-group">
                <label for="phone">Nomor WhatsApp (tanpa +):</label>
                <input
                    type="tel"
                    id="phone"
                    placeholder="62895800508215"
                    pattern="[0-9]{10,15}"
                    required
                >
                <small style="color: #666; font-size: 0.8rem;">
                    Contoh: 62895800508215 (Indonesia) atau 12894480825 (US)
                </small>
            </div>
            <button type="submit" class="btn" id="submitBtn">
                🔗 Dapatkan Kode Pairing
            </button>
        </form>

        <div id="result" style="display: none;"></div>

        <div class="features">
            <div class="feature">
                <div class="feature-icon">🔄</div>
                <div>Auto Reconnect</div>
            </div>
            <div class="feature">
                <div class="feature-icon">📱</div>
                <div>Multi-device</div>
            </div>
            <div class="feature">
                <div class="feature-icon">🛡️</div>
                <div>Stable</div>
            </div>
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <div>Fast</div>
            </div>
        </div>
    </div>

    <script>
        const form = document.getElementById('pairForm');
        const submitBtn = document.getElementById('submitBtn');
        const result = document.getElementById('result');
        const phoneInput = document.getElementById('phone');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const phone = phoneInput.value.trim();
            if (!phone) {
                showResult('Silakan masukkan nomor WhatsApp', 'error');
                return;
            }

            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Minta kode pairing...';
            result.style.display = 'none';

            try {
                const response = await fetch('/pair', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phone }),
                });

                const data = await response.json();

                if (data.ok) {
                    showResult(
                        \`✅ **Kode Pairing Berhasil!**

\`\`\`
\${data.code}
\`\`\`

**Instruksi:**
1. Buka WhatsApp
2. Menu > Linked Devices
3. Link a device
4. Masukkan kode di atas

Nomor: \${data.phone}
Bot: \${data.botName || '${BOT.name}'}

Kode berlaku selama 10 menit!\`,
                        'success'
                    );
                } else {
                    showResult(\`❌ **Error:** \${data.error}\`, 'error');
                }
            } catch (error) {
                showResult(\`❌ **Koneksi Error:** \${error.message}\`, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = '🔗 Dapatkan Kode Pairing';
            }
        });

        function showResult(message, type) {
            result.innerHTML = message;
            result.className = 'result ' + type;
            result.style.display = 'block';
            result.scrollIntoView({ behavior: 'smooth' });
        }

        // Auto-check status
        async function checkStatus() {
            try {
                const response = await fetch('/status');
                const status = await response.json();

                if (status.connected) {
                    document.querySelector('.info').innerHTML =
                        \`✅ <strong>Connected:</strong> \${status.user?.name || 'Bot Active'}<br>Multi-device session active across \${status.multiDevice ? 'multiple' : 'single'} device(s)\`;
                }
            } catch (e) {
                // Silent fail for status check
            }
        }

        // Check status every 5 seconds
        checkStatus();
        setInterval(checkStatus, 5000);
    </script>
</body>
</html>`;
}