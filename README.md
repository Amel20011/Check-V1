# 🌷 Liviaa WhatsApp Multi-device Bot

Bot WhatsApp canggih dengan dukungan multi-device yang stabil menggunakan fork Baileys terbaru (`@yemobyte/ye-bail`).

## ✨ Fitur Utama

### 📱 Multi-device Support
- **Multi-device Connection**: Terhubung hingga 4 perangkat secara bersamaan
- **Auto-sync**: Sinkronisasi otomatis pesan dan status
- **Cross-platform**: Bekerja di WhatsApp Web, Desktop, dan Mobile
- **Stable Connection**: Auto-reconnect dengan exponential backoff
- **Session Management**: Sesi multi-file yang andal

### 🛠️ Fitur Bot
- **Group Management**: Add, kick, promote, demote members
- **Anti-spam**: Automatic link detection and deletion
- **Welcome Messages**: Custom welcome for new group members
- **Interactive Messages**: List messages, buttons, rich text
- **Command System**: Modular command structure with prefix handling
- **Owner Commands**: Full control for bot owner

### 🌐 Web Interface
- **Pairing Portal**: Web interface untuk mudah pairing
- **Status Monitoring**: Real-time connection status
- **API Endpoints**: RESTful API untuk kontrol bot
- **Health Checks**: Monitor kesehatan bot

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20.0.0
- npm atau yarn

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/Amel20011/Check-V1.git
   cd Check-V1
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi Bot**

   Edit `config.js` sesuai kebutuhan:
   ```javascript
   export const BOT = {
     name: "Liviaa🌷",                    // Nama bot
     ownerNumber: "12894480825",         // Nomor owner (tanpa +)
     pairingNumber: "62895800508215",    // Nomor pairing (tanpa +)
     prefix: ".",                         // Prefix perintah
     mode: "public",                      // "public" atau "self"
     multiDevice: {
       enabled: true,                     // Enable multi-device
       maxDevices: 4,                     // Max connected devices
       autoSync: true,                    // Auto-sync messages
       presenceUpdates: true,             // Show presence updates
       readReceipts: true,                // Send read receipts
       onlineStatus: false,               // Show as online
       lastSeen: false,                   // Show last seen
       typingIndicators: true            // Send typing indicators
     },
     sessionDir: "./session",             // Directory untuk session files
     media: {                             // Media files
       menu: "./media/menu.jpg",
       welcome: "./media/welcome.jpg",
       qris: "./media/qris.jpg"
     }
   };
   ```

4. **Start Bot**

   **Development Mode:**
   ```bash
   npm run dev
   ```

   **Production Mode:**
   ```bash
   npm start
   ```

### 🔗 Pairing Process

Setelah bot dijalankan, ada dua cara untuk connect:

#### Method 1: QR Code (Terminal)
1. Bot akan menampilkan QR code di terminal
2. Buka WhatsApp > Menu > Linked Devices
3. Scan QR code dengan WhatsApp

#### Method 2: Pairing Code (Web Interface)
1. Buka web interface: `http://localhost:3000`
2. Masukkan nomor WhatsApp (format: 628xxxxx)
3. Klik "Dapatkan Kode Pairing"
4. Masukkan kode yang didapat ke WhatsApp

### 📱 Multi-device Commands

Bot memiliki perintah khusus untuk manajemen multi-device:

| Command | Deskripsi |
|---------|-----------|
| `.mdstatus` | Lihat status koneksi multi-device |
| `.mdsync` | Sinkronisasi semua perangkat |
| `.mddevices` | Daftar perangkat yang terhubung |
| `.multidevice` | Informasi multi-device |

### 🌐 Web Interface Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/` | GET | Pairing interface |
| `/pair` | POST | Get pairing code |
| `/status` | GET | Connection status |
| `/qr` | GET | QR code info |
| `/health` | GET | Health check |
| `/api` | GET | API documentation |

### 🔧 Configuration Options

#### Multi-device Settings
```javascript
multiDevice: {
  enabled: true,           // Enable multi-device features
  maxDevices: 4,          // Maximum connected devices
  autoSync: true,         // Auto-sync across devices
  presenceUpdates: true,   // Enable presence status
  readReceipts: true,     // Send read receipts
  onlineStatus: false,    // Show as always online
  lastSeen: false,        // Show last seen timestamp
  typingIndicators: true // Send typing indicators
}
```

#### Server Settings
```javascript
export const SERVER = {
  host: "0.0.0.0",        // Server host
  port: 3000              // Server port
};
```

## 📂 Project Structure

```
Check-V1/
├── index.js                    # Main entry point
├── config.js                   # Configuration file
├── lib/                        # Core libraries
│   ├── connection.js           # WhatsApp connection handler
│   ├── server.js               # HTTP server & web interface
│   ├── handler.js              # Message & command handler
│   ├── message.js              # Message formatting
│   ├── utils.js                # Utility functions
│   ├── database.js             # Database operations
│   ├── group.js                # Group utilities
│   └── permission.js           # Permission checks
├── commands/                   # Command modules
│   ├── main/                   # Main commands
│   ├── group/                  # Group management
│   ├── owner/                  # Owner-only commands
│   └── multidevice/           # Multi-device commands
├── plugins/                    # Plugin system
├── database/                   # Data storage (JSON)
├── session/                    # WhatsApp session files
├── media/                      # Media files
└── logs/                       # Log files
```

## 🔒 Security Features

- **Session Encryption**: Session data terenkripsi
- **Permission System**: Owner/admin role checks
- **Rate Limiting**: Command rate limiting (400ms)
- **Input Validation**: Validasi input untuk防止 crash
- **CORS Protection**: Secure web interface headers

## 🛠️ Troubleshooting

### Common Issues

1. **QR Code Tidak Muncul**
   ```bash
   # Clear session and restart
   rm -rf session/*
   npm start
   ```

2. **Connection Timed Out**
   - Periksa koneksi internet
   - Coba restart bot dengan exponential backoff
   - Pastikan WhatsApp tidak sedang maintenance

3. **Multi-device Error**
   ```bash
   # Check multi-device status
   .mdstatus

   # Resync devices
   .mdsync
   ```

4. **Session Corrupted**
   ```bash
   # Backup current session
   cp -r session session.backup

   # Clear and re-pair
   rm -rf session/*
   npm start
   ```

### Log Monitoring
Bot menggunakan structured logging dengan pino. Untuk development:
```bash
NODE_ENV=development npm run dev
```

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start bot with PM2
pm2 start index.js --name "liviaa-bot"

# Monitor
pm2 monit

# View logs
pm2 logs liviaa-bot
```

### Environment Variables
```bash
# Development
export NODE_ENV=development

# Production
export NODE_ENV=production
```

## 📱 Multi-device Best Practices

1. **Device Management**: Jangan menghubungkan lebih dari 4 perangkat
2. **Session Backup**: Backup folder `session/` secara regular
3. **Monitoring**: Gunakan `.mdstatus` untuk monitoring koneksi
4. **Sync**: Jalankan `.mdsync` setelah menambah device baru
5. **Security**: Hapus device yang tidak digunakan dari WhatsApp

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Baileys**: WhatsApp Web library
- **@yemobyte/ye-bail**: Enhanced Baileys fork
- **Pino**: Structured logging
- **Node.js**: Runtime environment

## 📞 Support

Jika mengalami masalah:
- Check troubleshooting section
- Open issue di GitHub
- Contact owner: `@${BOT.ownerNumber}`

---

**⚠️ Disclaimer**: Bot ini untuk tujuan edukasi dan penggunaan pribadi. Gunakan dengan bertanggung jawab dan ikuti ToS WhatsApp.