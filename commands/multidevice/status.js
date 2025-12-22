import { getCurrentUser, isConnectionHealthy, getConnectionState } from "../../lib/connection.js";

export default async (sock, m, { BOT }) => {
  try {
    const user = getCurrentUser();
    const isHealthy = isConnectionHealthy();
    const connState = getConnectionState();

    const statusText = `📱 **Multi-device Status** 📱

🔗 **Connection:** ${isHealthy ? '✅ Connected' : '❌ Disconnected'}
👤 **Bot Number:** ${user ? user.id.split(':')[0] : 'Unknown'}
📛 **Bot Name:** ${user?.name || user?.verifiedName || BOT.name}

🔄 **Reconnect Attempts:** ${connState.reconnectAttempts}/${connState.maxReconnectAttempts}
🔧 **Connection State:** ${connState.isConnecting ? 'Connecting...' : 'Idle'}

📋 **Multi-device Features:**
${BOT.multiDevice.enabled ? '✅ Enabled' : '❌ Disabled'}
${BOT.multiDevice.autoSync ? '🔄 Auto-sync: ON' : '🔄 Auto-sync: OFF'}
${BOT.multiDevice.presenceUpdates ? '👤 Presence: ON' : '👤 Presence: OFF'}
${BOT.multiDevice.readReceipts ? '📖 Read receipts: ON' : '📖 Read receipts: OFF'}

⏰ **Uptime:** ${formatUptime(process.uptime())}

${BOT.footer}`;

    await sock.sendMessage(m.key.remoteJid, {
      text: statusText
    });

  } catch (error) {
    console.error("❌ Error in multi-device status command:", error);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Error getting multi-device status: ${error.message}`
    });
  }
};

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}