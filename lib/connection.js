import pkg from "@whiskeysockets/baileys";
const {
  makeWASocket,
  useMultiFileAuthState,
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  delay
} = pkg;
import pino from "pino";
import { BOT } from "../config.js";
import { registerHandlers } from "./handler.js";
import { Boom } from "@hapi/boom";

let currentSock = null;
let connectionState = {
  lastDisconnect: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 10,
  isConnecting: false
};

export function getSock() {
  return currentSock;
}

export function getConnectionState() {
  return connectionState;
}

async function createConnection() {
  if (connectionState.isConnecting) {
    console.log("🔄 Connection already in progress...");
    return;
  }

  connectionState.isConnecting = true;

  try {
    console.log("🔧 Initializing WhatsApp multi-device connection...");

    // Get latest WhatsApp Web version for better compatibility
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`📱 WhatsApp Web version: ${version}, Latest: ${isLatest}`);

    const { state, saveCreds } = await useMultiFileAuthState(BOT.sessionDir);

    const sock = makeWASocket({
      version,
      auth: state,
      logger: pino({
        level: process.env.NODE_ENV === "development" ? "debug" : "silent",
        timestamp: () => `,"time":"${new Date().toISOString()}"`
      }),
      printQRInTerminal: true,
      browser: Browsers.macOS("Safari"),
      markOnlineOnConnect: false,
      syncFullHistory: false,
      // Multi-device specific options
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 30000,
      qrTimeout: 60000,
      defaultQueryTimeoutMs: undefined,
      generateHighQualityLinkPreview: true,
      // Enable better message sync for multi-device
      syncFullHistory: false,
      shouldSyncHistoryMessage: (msg) => false,
      // Improve reliability
      retryRequestDelayMs: 250,
      maxMsgRetryDelayMs: 30 * 1000,
      agent: undefined
    });

    currentSock = sock;

    // Event handlers for better multi-device support
    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr, isNewLogin } = update;

      if (qr) {
        console.log("📲 QR Code received! Scan or use /pair for pairing code.");
        console.log("🔗 Multi-device enabled - this works across multiple devices!");
      }

      if (isNewLogin) {
        console.log("🎉 New login detected! Multi-device session established.");
        connectionState.reconnectAttempts = 0;
      }

      if (connection === "open") {
        console.log(`✅ Connected as ${BOT.name}`);
        console.log(`📱 Multi-device connection active across all linked devices`);
        console.log(`👤 Bot Number: ${sock.user.id.split(':')[0]}`);
        connectionState.reconnectAttempts = 0;
        connectionState.isConnecting = false;
      }

      if (connection === "close") {
        connectionState.lastDisconnect = lastDisconnect;
        connectionState.isConnecting = false;

        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log("❌ Connection closed due to:", lastDisconnect?.error?.message || "Unknown reason");

        if (shouldReconnect) {
          if (connectionState.reconnectAttempts < connectionState.maxReconnectAttempts) {
            connectionState.reconnectAttempts++;
            const delayMs = Math.min(1000 * Math.pow(2, connectionState.reconnectAttempts), 30000);

            console.log(`🔄 Reconnecting in ${delayMs/1000}s... (Attempt ${connectionState.reconnectAttempts}/${connectionState.maxReconnectAttempts})`);
            setTimeout(startConnection, delayMs);
          } else {
            console.log("❌ Max reconnection attempts reached. Please restart the bot.");
          }
        } else {
          console.log("🚪 Logged out. Please scan QR code again.");
          connectionState.reconnectAttempts = 0;
        }
      }
    });

    // Handle authentication failures
    sock.ev.on("auth.failure", (reason) => {
      console.log("❌ Authentication failed:", reason);
      console.log("🔄 Please clear session and restart the bot.");
    });

    // Handle missed calls (optional feature for multi-device)
    sock.ev.on("call", async (call) => {
      console.log(`📞 Missed call from ${call.from}`);
      // Optional: handle calls automatically
    });

    // Handle presence updates for multi-device sync
    sock.ev.on("presence.update", (presence) => {
      if (process.env.NODE_ENV === "development") {
        console.log("👤 Presence update:", presence);
      }
    });

    await registerHandlers(sock);
    console.log("🎯 Event handlers registered successfully");

    return sock;

  } catch (error) {
    console.error("❌ Failed to create connection:", error);
    connectionState.isConnecting = false;
    throw error;
  }
}

export async function startConnection() {
  try {
    if (currentSock?.ev) {
      // Clean up existing connection
      currentSock.ev.removeAllListeners();
      currentSock.ws?.close();
    }

    return await createConnection();
  } catch (error) {
    console.error("❌ Failed to start connection:", error);
    throw error;
  }
}

export async function disconnect() {
  if (currentSock) {
    console.log("🔌 Disconnecting WhatsApp connection...");
    currentSock.ev.removeAllListeners();
    currentSock.ws?.close();
    currentSock = null;
    connectionState.isConnecting = false;
    console.log("✅ Disconnected successfully");
  }
}

// Helper function to check connection health
export function isConnectionHealthy() {
  return currentSock?.user !== undefined && connectionState.isConnecting === false;
}

// Helper function to get current user info
export function getCurrentUser() {
  return currentSock?.user || null;
}