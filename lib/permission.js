import { BOT } from "../config.js";

export const isOwner = (sender) => {
  const senderNum = sender.split("@")[0];
  return senderNum.includes(BOT.ownerNumber);
};

export const requireAdmin = async (sock, jid, sender) => {
  const md = await sock.groupMetadata(jid);
  const admins = md.participants.filter(p => p.admin).map(p => p.id);
  return admins.includes(sender);
};
