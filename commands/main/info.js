import { BOT } from "../../config.js";
export default async (sock, m) => {
  await sock.sendMessage(m.key.remoteJid, { text: `🌷 ${BOT.name} aktif. Prefix: ${BOT.prefix} 💗` });
};
