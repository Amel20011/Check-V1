export const getGroupMetadata = (sock, jid) => sock.groupMetadata(jid);

export const getParticipants = async (sock, jid) => {
  const md = await getGroupMetadata(sock, jid);
  return md.participants.map(p => p.id);
};

export const getAdmins = async (sock, jid) => {
  const md = await getGroupMetadata(sock, jid);
  return md.participants.filter(p => p.admin).map(p => p.id);
};
