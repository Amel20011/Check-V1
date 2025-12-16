
---

# lib

### proyek-bot/lib/connection.js
```js
import makeWASocket, { useMultiFileAuthState, Browsers } from "@yemobyte/ye-bail";
import pino from "pino";
import { BOT } from "../config.js";
import { registerHandlers } from "./handler.js";

let currentSock = null;

export function getSock() { return currentSock; }

export async function startConnection() {
  const { state, saveCreds } = await useMultiFileAuthState(BOT.sessionDir);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: process.env.NODE_ENV === "development" ? "debug" : "silent" }),
    browser: Browsers.macOS("Safari"),
    printQRInTerminal: true,
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  currentSock = sock;

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", (u) => {
    const { connection, lastDisconnect, qr } = u;
    if (qr) console.log("📲 Scan QR atau gunakan /pair untuk kode pairing.");
    if (connection === "open") console.log(`✅ Connected as ${BOT.name}`);
    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      console.log("Connection closed.", lastDisconnect?.error?.message || "");
      if (code !== 401) startConnection();
    }
  });

  await registerHandlers(sock);
  return sock;
}
