# Backend Structure Document

This document outlines the backend setup for the "Liviaa🌷" WhatsApp bot, covering its architecture, data handling, APIs, hosting, infrastructure, security, and maintenance strategies. It uses straightforward language so that anyone—technical or not—can understand how the backend works.

## 1. Backend Architecture

### 1.1 Overall Design
- The bot is built on **Node.js** and uses **ES modules** for clean, modular code.
- It relies on the forked Baileys library (`@yemobyte/ye-bail`) to communicate with WhatsApp Web, handling connection, messaging, and session state.
- The code is organized into distinct pieces:
  - **Connection module** (`lib/connection.js`) handles socket setup and event listening.
  - **Message handler** (`lib/handler.js`) routes incoming messages to the right command.
  - **Commands folder** (`commands/`) holds all user- and admin-facing bot commands.
  - **Database module** (`lib/database.js`) reads and writes JSON files.
  - **Configuration file** (`config.js`) stores all settings in one place.
  - **Utilities** (`lib/message.js`, `lib/permission.js`) provide messaging helpers and permission checks.
  - **Plugins folder** (`plugins/`) for future extensions.

### 1.2 Scalability, Maintainability, Performance
- **Scalability**: The modular command structure makes it easy to add or update features without touching core logic. Moving from JSON files to a full database (like MongoDB or SQLite) is straightforward thanks to the single database module.
- **Maintainability**: Centralizing settings in `config.js` and grouping related code into folders means new developers can find and change things quickly.
- **Performance**: Asynchronous patterns (`async/await`) keep the bot responsive. Logging via **pino** helps trace issues without blocking the main flow.

## 2. Database Management

### 2.1 Technology and Type
- **Type**: File-based storage (a simple form of NoSQL)
- **Technology**: JSON files on disk, managed via custom functions in `lib/database.js`.

### 2.2 Data Structure and Practices
- Data is split into separate JSON files, for example:
  - `users.json` tracks user IDs and metadata.
  - `groups.json` holds group settings and admin lists.
  - `premium.json` lists users with extra privileges.
- **Access**: The database module exposes functions like `addUser()`, `isUser()`, `getGroupSettings()`, etc.
- **Best Practices**:
  - Read the entire file into memory, update the JavaScript object, then write it back in one go to avoid partial writes.
  - Use `try...catch` around file operations to catch and log errors.
  - Backup JSON files regularly using the owner’s backup command.

## 3. Database Schema (JSON Format)

Below is a human-readable outline of the main JSON files and their key fields:

### 3.1 users.json
- An array of user records:
  - `id`: WhatsApp user ID (string)
  - `name`: Display name (string)
  - `joinedAt`: Timestamp when first seen by the bot (string or number)

### 3.2 groups.json
- An array of group records:
  - `groupId`: WhatsApp group ID (string)
  - `name`: Group name (string)
  - `admins`: Array of user IDs (array of strings)
  - `settings`: Object that may include:
    - `isMuted` (boolean)
    - `antiLink` (boolean)
    - `welcomeMessage` (string)

### 3.3 premium.json
- An array of premium user IDs (array of strings)

## 4. API Design and Endpoints

### 4.1 Pairing Endpoint
- **Endpoint**: `/pair`
- **Method**: GET (could be POST with a token in the future)
- **Purpose**: Provides the QR code or connection data to link the bot to a WhatsApp account.
- **Flow**:
  1. User visits `http://<server>:<port>/pair`.
  2. Server responds with the current authentication QR code or a status message.
  3. Once scanned, the bot’s session is stored in the JSON-based auth state.

### 4.2 Future API Considerations
- If needed, additional endpoints (e.g., `/status`, `/stats`) can be added using the same built-in HTTP server or a lightweight framework like Express.

## 5. Hosting Solutions

### 5.1 Environment Options
- **Self-managed VPS** (e.g., DigitalOcean, Linode): You get a Linux server where you install Node.js and run the bot.
- **Cloud VM** (e.g., AWS EC2, Azure VM, Google Compute Engine): Similar to a VPS but with more built-in scaling options.
- **Containerized Deployment** (Docker on AWS ECS, Google Cloud Run): Package the bot in a Docker container for easier portability and auto-scaling.

### 5.2 Benefits of the Chosen Approach
- **Reliability**: Cloud providers offer uptime SLAs and automated snapshots.
- **Scalability**: You can increase CPU/RAM or spin up multiple instances as needed.
- **Cost-effectiveness**: Pay only for what you use, with the ability to choose smaller instances for low-traffic scenarios.

## 6. Infrastructure Components

### 6.1 Process Management
- **PM2** or a similar tool ensures that the bot restarts automatically if it crashes.

### 6.2 Load Balancing (Optional)
- For high-traffic groups, you could place an NGINX or HAProxy in front of multiple bot instances to distribute incoming pairing or management requests.

### 6.3 Caching (Future)
- **Redis** can cache group settings or rate-limit data to reduce disk reads.

### 6.4 Logging and CDN
- **Pino** streams logs to local files or a log collector (e.g., Loggly, ELK stack).
- A CDN is generally not required, as there’s no static asset delivery beyond the pairing page.

## 7. Security Measures

### 7.1 Authentication & Authorization
- **WhatsApp Encryption**: The Baileys socket layer automatically handles message encryption.
- **Pair Endpoint**: Currently open; recommend adding a secret token, IP whitelist, or basic auth.
- **Command Permissions**: `lib/permission.js` enforces:
  - **Owner-only commands** (`isOwner()`) for critical actions.
  - **Admin-only group commands** (`requireAdmin()`).

### 7.2 Data Protection
- Session files and JSON data should be stored in a secure directory with restricted file-system permissions.
- Regularly back up the data folder to prevent data loss.

### 7.3 Compliance
- User phone numbers and group metadata remain on your server. Ensure you follow relevant data-privacy regulations (e.g., GDPR) when storing personal data.

## 8. Monitoring and Maintenance

### 8.1 Monitoring
- **PM2 Dashboard** or a hosted solution tracks uptime, CPU/memory usage, and restarts.
- **Log Aggregation**: Forward pino logs to a centralized service for easy searching and alerting.

### 8.2 Maintenance Strategies
- **Automated Backups**: Use cron jobs or PM2 scripts to back up JSON files nightly.
- **Dependency Updates**: Periodically run `npm audit` and update libraries (particularly the WhatsApp connector) to stay secure.
- **Error Handling**: Enhance `try...catch` blocks in file and network operations to prevent unexpected crashes.

## 9. Conclusion and Overall Backend Summary

The Liviaa🌷 bot’s backend is a streamlined Node.js application that leverages a modular design, JSON file storage, and the Baileys fork for real-time WhatsApp interaction. Its key strengths are:

- A clear separation of concerns, making it easy to add or modify commands without touching the core logic.
- Simple JSON-based storage that works out of the box, with a clear upgrade path to a full database when needed.
- Built-in pairing endpoint to simplify setup.
- Permission enforcement to keep owner-only and admin functions secure.

While the current setup is perfect for small to medium use, it can grow by adopting a more robust database, adding caching, and deploying on container platforms. Overall, this backend structure balances ease of use with room for future expansion.