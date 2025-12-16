import { BOT } from "../../config.js";
export default async (sock, m) => {
  BOT.mode = "public";
  await sock.sendMessage(m.key.remoteJid, { text: "🌷 Mode PUBLIC — semua bisa pakai." });
};
