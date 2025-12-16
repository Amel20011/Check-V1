import fs from "fs";
import fse from "fs-extra";

const PATHS = {
  users: "./database/users.json",
  groups: "./database/groups.json",
  premium: "./database/premium.json"
};

Object.values(PATHS).forEach((p) => {
  if (!fs.existsSync(p)) fse.outputJsonSync(p, []);
});

export const addUser = (jid) => {
  const data = JSON.parse(fs.readFileSync(PATHS.users, "utf-8"));
  if (!data.includes(jid)) data.push(jid);
  fs.writeFileSync(PATHS.users, JSON.stringify(data, null, 2));
};

export const isUser = (jid) => {
  const data = JSON.parse(fs.readFileSync(PATHS.users, "utf-8"));
  return data.includes(jid);
};
