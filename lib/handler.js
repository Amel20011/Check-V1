import { BOT } from "../config.js";
import { formatMenuListMessage } from "./message.js";
import { isCmd, getBody } from "./utils.js";
import { routeCommand } from "../commands/main/menu.js";

const rate = new Map(); // jid -> timestamp
const throttleMs = 400;

function allow(jid) {
  const now = Date.now();
  const last = rate.get(jid) || 0;
  if (now - last < throttleMs) return false;
  rate.set(jid, now);
  return true;
}

export async function registerHandlers(sock) {
  // Main router
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m?.message || m.key.remoteJid === "status@broadcast") return;

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const pushname = m.pushName || "Sayang";
    const body = getBody(m);
    const isCommand = isCmd(body, BOT.prefix);

    if (!allow(from)) return;

    if (BOT.mode === "self") {
      const senderNum = sender.split("@")[0];
      if (!senderNum.includes(BOT.ownerNumber)) return;
    }

    if (/^(hi|hai|halo|menu)$/i.test(body)) {
      await sock.sendMessage(from, formatMenuListMessage(pushname));
      return;
    }

    if (isCommand) {
      await routeCommand(sock, m, body);
      return;
    }
  });

  // Handle list/button selections
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m?.message) return;
    const from = m.key.remoteJid;
    if (!allow(from)) return;

    const msg = m.message;

    if (msg?.listResponseMessage?.singleSelectReply) {
      const { selectedRowId } = msg.listResponseMessage.singleSelectReply;
      await routeCommand(sock, m, selectedRowId);
    }

    if (msg?.buttonsResponseMessage) {
      const id = msg.buttonsResponseMessage.selectedButtonId;
      if (id === "btn_ping") await sock.sendMessage(from, { text: "ᯓᡣ𐭩 Pong! 💗" });
      if (id === "btn_owner") await sock.sendMessage(from, { text: `🌹 Owner: ${BOT.ownerNumber} — ${BOT.name}` });
      if (id === "btn_allmenu") {
        const { renderAllMenu } = await import("../commands/main/allmenu.js");
        await sock.sendMessage(from, await renderAllMenu());
      }
    }
  });

  // Group welcome
  sock.ev.on("group-participants.update", async (update) => {
    const mod = await import("../plugins/welcome.js");
    await mod.default(sock, update);
  });
}
