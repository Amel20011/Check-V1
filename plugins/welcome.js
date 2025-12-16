import { BOT } from "../config.js";
export default async function onGroupParticipantUpdate(sock, update) {
  const { id: jid, participants, action } = update;
  if (action === "add") {
    for (const p of participants) {
      await sock.sendMessage(jid, {
        text: `🌷 Selamat datang @${p.split("@")[0]} di grup!\nᥫ᭡ Nikmati fitur lucu dari ${BOT.name} 💗`,
        mentions: [p]
      });
    }
  }
  if (action === "remove") {
    for (const p of participants) {
      await sock.sendMessage(jid, { text: `🌹 Dadah @${p.split("@")[0]}~`, mentions: [p] });
    }
  }
}
