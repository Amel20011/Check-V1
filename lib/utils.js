import { BOT } from "../config.js";

export const isCmd = (text, prefix = BOT.prefix) => !!text && text.startsWith(prefix);

export const getBody = (m) => {
  const msg = m.message;
  return msg?.conversation
    || msg?.extendedTextMessage?.text
    || msg?.imageMessage?.caption
    || msg?.videoMessage?.caption
    || msg?.buttonsResponseMessage?.selectedButtonId
    || msg?.listResponseMessage?.singleSelectReply?.selectedRowId
    || "";
};

export const jidToNumber = (jid) => jid?.split("@")[0];

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
