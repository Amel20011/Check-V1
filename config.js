export const BOT = {
  name: "Liviaa🌷",
  ownerNumber: "12894480825",         // Owner (US/CA), no '+'
  pairingNumber: "62895800508215",    // Pairing (Indonesia), no '+'
  prefix: ".",
  mode: "public", // "public" | "self"
  footer: "ᥫ᭡ ⋆˚꩜｡ Liviaa🌷 𓂃💗",
  brand: "ᯓᡣ𐭩 ⋆.𐙚 ̊ ⋆˚꩜｡ᥫ᭡",
  sessionDir: "./session",
  // Multi-device specific settings
  multiDevice: {
    enabled: true,
    maxDevices: 4,                    // Maximum connected devices
    autoSync: true,                   // Auto-sync messages across devices
    presenceUpdates: true,            // Enable presence updates
    readReceipts: true,               // Send read receipts
    onlineStatus: false,              // Show as online
    lastSeen: false,                  // Show last seen
    typingIndicators: true           // Send typing indicators
  },
  media: {
    menu: "./media/menu.jpg",
    welcome: "./media/welcome.jpg",
    qris: "./media/qris.jpg"
  }
};

export const SERVER = {
  host: "0.0.0.0",
  port: 3000
};

export const UI = {
  boldCute: (s) => `⋆˚꩜｡ ${s} 𓂃💗`,
  title: (s) => `ᯓᡣ𐭩 ${s} ⋆.𐙚`,
  bullet: "ᥫ᭡",
  icons: ["🌷", "☘️", "💗", "🌹"]
};
