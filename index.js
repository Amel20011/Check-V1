import { startConnection, getSock } from "./lib/connection.js";
import { startServer } from "./lib/server.js";
import { BOT, SERVER } from "./config.js";

(async () => {
  console.log(`Starting ${BOT.name}…`);
  await startConnection();
  await startServer(() => getSock(), SERVER);
})();
