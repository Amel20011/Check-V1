import { formatMenuListMessage } from "../../lib/message.js";
import { addUser, isUser } from "../../lib/database.js";
import { BOT } from "../../config.js";

export async function routeCommand(sock, m, body) {
  const from = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;
  const pushname = m.pushName || "Sayang";

  if (body.startsWith(`${BOT.prefix}menu`) || body === ".allmenu") {
    const { renderAllMenu } = await import("./allmenu.js");
    if (body === ".allmenu") return sock.sendMessage(from, await renderAllMenu());
    return sock.sendMessage(from, formatMenuListMessage(pushname));
  }

  if (body.startsWith(`${BOT.prefix}ping`)) {
    return sock.sendMessage(from, { text: "⋆˚꩜｡ Pong! 💗" });
  }

  if (body.startsWith(`${BOT.prefix}owner`)) {
    return sock.sendMessage(from, { text: `🌹 Owner: ${BOT.ownerNumber} — ${BOT.name}` });
  }

  if (body.startsWith(`${BOT.prefix}daftar`)) {
    if (isUser(sender)) return sock.sendMessage(from, { text: "☘️ Kamu sudah terdaftar, sayang~ 💗" });
    addUser(sender);
    return sock.sendMessage(from, { text: "🌷 Berhasil daftar! ᥫ᭡ Selamat bergabung 💗" });
  }

  // Group commands pass-through
  if (body.startsWith(`${BOT.prefix}`)) {
    const cmd = body.split(" ")[0].slice(BOT.prefix.length);
    try {
      if ([
        "tagall","hidetag","antilink","add","kick","promote","demote",
        "setname","setdesc","mute","unmute","linkgroup","revoke","delete"
      ].includes(cmd)) {
        const mod = await import(`../group/${cmd}.js`);
        await mod.default(sock, m, body);
        return;
      }
      if (["info","owner"].includes(cmd)) {
        const mod = await import(`./${cmd}.js`);
        await mod.default(sock, m, body);
        return;
      }
      if (["self","public","setppbot","restart","shutdown","backup","block","unblock"].includes(cmd)) {
        const mod = await import(`../owner/${cmd}.js`);
        await mod.default(sock, m, body);
        return;
      }
    } catch (e) {
      await sock.sendMessage(from, { text: "🌹 Maaf, perintah belum tersedia." });
    }
  }
}
