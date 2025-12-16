import { BOT, UI } from "../../config.js";

export const renderAllMenu = async () => {
  const lines = [
    `${UI.title("Main")} 💗`,
    "ᥫ᭡ .menu — Menu daftar (List Message)",
    "ᥫ᭡ .ping — Cek nyawa bot",
    "ᥫ᭡ .owner — Kontak Liviaa🌷",
    "ᥫ᭡ .daftar — Registrasi pengguna",
    "",
    `${UI.title("Group")} 🌷`,
    "ᥫ᭡ .tagall — Mention semua",
    "ᥫ᭡ .hidetag — Mention tersembunyi",
    "ᥫ᭡ .antilink on/off — Anti link WA",
    "ᥫ᭡ .add 628xx — Tambah member",
    "ᥫ᭡ .kick @user — Keluarkan member",
    "ᥫ᭡ .promote/demote @user — Naik/turun admin",
    "ᥫ᭡ .setname teks — Nama grup",
    "ᥫ᭡ .setdesc teks — Deskripsi grup",
    "ᥫ᭡ .mute / .unmute — Tutup/buka chat",
    "ᥫ᭡ .linkgroup — Ambil tautan",
    "ᥫ᭡ .revoke — Reset undangan",
    "ᥫ᭡ .delete — Hapus pesan bot (reply)",
    "",
    `${UI.title("Owner")} 🌹`,
    "ᥫ᭡ .public / .self — Mode bot",
    "ᥫ᭡ .setppbot (reply img) — Foto bot",
    "ᥫ᭡ .restart / .shutdown",
    "ᥫ᭡ .backup — Backup database",
    "ᥫ᭡ .block / .unblock @user",
    ""
  ];
  return { text: lines.join("\n"), footer: BOT.footer };
};
