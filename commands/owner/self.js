import { BOT } from "../../config.js";
export default async (sock, m) => {
  BOT.mode = "self";
  await sock.sendMessage(m.key.remoteJid, { text: "🌹 Mode SELF — hanya owner yang bisa pakai." });
};
