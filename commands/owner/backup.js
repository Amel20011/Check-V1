import fse from "fs-extra";

export default async (sock, m) => {
  const time = Date.now();
  const dst = `./backup-${time}`;
  await fse.copy("./database", `${dst}/database`);
  await fse.copy("./session", `${dst}/session`);
  await sock.sendMessage(m.key.remoteJid, { text: `💗 Backup tersimpan di ${dst}` });
};
