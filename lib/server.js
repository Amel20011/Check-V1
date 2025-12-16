import http from "http";

export async function startServer(getSock, { host, port }) {
  const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

    if (req.method === "POST" && req.url === "/pair") {
      let body = "";
      req.on("data", (chunk) => body += chunk);
      req.on("end", async () => {
        try {
          const data = JSON.parse(body || "{}");
          const phone = (data.phone || "").replace(/\D/g, "");
          if (!phone) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ ok: false, error: "Missing 'phone' (e.g. 62895800508215)" }));
          }
          const sock = getSock();
          if (!sock?.requestPairingCode) {
            res.writeHead(503, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ ok: false, error: "Pairing not ready" }));
          }
          const code = await sock.requestPairingCode(phone); // no '+', you asked for 62 format
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ ok: true, code }));
        } catch (e) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: e.message }));
        }
      });
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "not found" }));
  });

  await new Promise((resolve) => server.listen(port, host, resolve));
  console.log(`✅ Pairing server listening at http://${host}:${port}/pair`);
}
