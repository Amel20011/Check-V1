import { BOT, UI } from "../config.js";
import fs from "fs";

export const formatMenuListMessage = (pushname = "Sayang") => ({
  text:
    `🌷 ᥫ᭡ Haii~ ${pushname} 💗\n` +
    `Apa yang bisa kami bantu?\n\n` +
    `📝 Pilih layanan di bawah ini:`,
  buttonText: "Pilih Menu",
  description: "Silakan pilih layanan di bawah ini:",
  sections: [
    {
      title: UI.title("Layanan Utama"),
      rows: [
        { title: "Ngobrol dgn Agent 3Care", rowId: "chat_agent" },
        { title: "Solusi Keuangan", rowId: "finance_solution" },
        { title: "Tips & Trik", rowId: "tips_trik" }
      ]
    },
    {
      title: UI.title("Navigasi"),
      rows: [
        { title: "Kembali ke Menu Utama", rowId: "main_menu" },
        { title: "𓂃 Menu Lengkap ⋆.𐙚", rowId: ".allmenu" }
      ]
    }
  ],
  footer: BOT.footer
});

export const sendAestheticButtons = async (sock, jid, pushname = "Sayang") => {
  const text =
    `ᯓᡣ𐭩 ${BOT.name} menyapa kamu, ${pushname}! 🌷\n` +
    `Pilih aksi cepat di bawah ini yaa~ ☘️`;

  const buttons = [
    { buttonId: "btn_ping", buttonText: { displayText: "⋆˚꩜｡ Ping ᥫ᭡" }, type: 1 },
    { buttonId: "btn_owner", buttonText: { displayText: "🌹 Contact Owner 💗" }, type: 1 },
    { buttonId: "btn_allmenu", buttonText: { displayText: "𓂃 Menu Lengkap ⋆.𐙚" }, type: 1 }
  ];

  await sock.sendMessage(jid, { text, footer: BOT.footer, buttons, headerType: 1 });
};

export const sendImageWithButtons = async (sock, jid, path, caption) => {
  const buffer = fs.existsSync(path) ? fs.readFileSync(path) : undefined;
  await sock.sendMessage(jid, {
    image: buffer,
    caption,
    footer: BOT.footer,
    buttons: [
      { buttonId: "btn_ping", buttonText: { displayText: "ᥫ᭡ Ping" }, type: 1 },
      { buttonId: "btn_owner", buttonText: { displayText: "🌷 Owner" }, type: 1 }
    ],
    headerType: 4
  });
};
