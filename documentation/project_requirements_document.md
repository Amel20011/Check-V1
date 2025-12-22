# Project Requirements Document (PRD)

## 1. Project Overview

**Liviaa🌷** is a feature-rich WhatsApp bot built with Node.js and a fork of the Baileys library (`@yemobyte/ye-bail`). It’s designed to solve the common pain point of manual group moderation and user engagement on WhatsApp. By automating group administration tasks—adding or removing members, promoting/demoting admins, updating group metadata, enforcing anti-spam, and more—the bot helps group owners and administrators manage large or active communities with ease.

Beyond group management, Liviaa offers interactive user experiences through list menus, buttons, and welcome messages, plus a suite of owner-only commands for full control (restart, shutdown, profile updates, backups). A built-in HTTP pairing endpoint simplifies initial setup, eliminating manual session file handling. The key objectives are reliability (auto-reconnect, 99% uptime), responsiveness (command replies within 1s), and ease of use (simple pairing, clear feedback). Success will be measured by robust uptime, low error rates, and positive admin/user adoption.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (v1)**
- Core group management commands (add/kick/promote/demote, metadata updates, mute/unmute, invite link management).
- Owner-specific commands (mode switch, restart, shutdown, backup, block/unblock, profile picture change).
- Interactive features (list messages, buttons, welcome messages).
- Anti-spam measures (delete links, command rate-limiting).
- HTTP server with `/pair` endpoint for QR-code pairing.
- JSON file–based storage (user lists, group settings).
- Centralized `config.js` for settings.
- Structured logging with `pino`.

**Out-of-Scope (v1)**
- Web or mobile dashboard for monitoring or manual control.
- Migration to a SQL/NoSQL database (beyond JSON files).
- Advanced rate limiting or analytics.
- Multi-language support.
- Built-in unit/integration tests or CI/CD pipelines.
- End-to-end encryption management beyond WhatsApp’s defaults.

## 3. User Flow

When an administrator first runs Liviaa on a server or local machine, they launch the Node.js process. The bot spins up an HTTP server exposing `/pair`, which serves a QR code. The admin scans this QR code in WhatsApp Web to authenticate, and the bot stores session data in JSON files. Once paired, the bot auto-reconnects on restarts or network drops.

In day-to-day use, group members or admins send messages prefixed with a dot (`.`) to issue commands. For example, an admin types `.add +1234567890` and the bot adds that user to the group. Users can navigate menus via interactive list messages and buttons. When new members join, the bot sends a personalized welcome message. If someone posts a link in violation of group rules, the bot deletes it. The owner can use commands like `.restart` or `.shutdown` at any time for maintenance.

## 4. Core Features

- **WhatsApp Connection & Session Management**: Automatic QR pairing via `/pair` endpoint, persistent multi-file auth state.
- **Command Processor**: Detects prefix, parses messages, routes to appropriate handler.
- **Group Management Module**: Add/remove members, promote/demote admins, update group name/description, mute/unmute, invite link creation/revocation.
- **Owner Commands Module**: Switch bot modes (public/self), restart/shutdown, create backups, block/unblock users, update bot profile picture.
- **Interactive Messaging**: Render list menus and buttons, handle user selections.
- **Welcome & Anti-spam**: Custom welcome texts, link detection/deletion, basic rate-limiting.
- **HTTP Pairing Endpoint**: Simple pairing server using Express (or built-in HTTP), minimal setup.
- **Configuration Management**: Single `config.js` for prefix, owner number, UI texts.
- **File-based Data Store**: Read/write JSON files via a wrapper API (`lib/database.js`).
- **Logging**: Structured logs (info/error/debug) with `pino`.
- **Permission Enforcement**: `isOwner`, `requireAdmin` checks before sensitive commands.

## 5. Tech Stack & Tools

- **Runtime & Language**: Node.js (>=14), JavaScript (ES Modules).
- **WhatsApp API**: `@yemobyte/ye-bail` fork of Baileys for WebSocket communication.
- **HTTP Server**: Express.js (or Node’s `http` module) for pairing endpoint.
- **Logging**: `pino` for configurable, structured logs.
- **Data Storage**: JSON files managed via a custom wrapper (`lib/database.js`).
- **Code Quality**: ESLint + Prettier (recommended), JSDoc for inline documentation.
- **Testing**: (Future) Jest or Mocha for unit tests.
- **IDE & Plugins**: VSCode with ESLint, Prettier, VSCode-Node debug extension.
- **Optional Dev Tools**: Nodemon for hot reload during development.

## 6. Non-Functional Requirements

- **Performance**: Command response within 1 second; pairing QR code generation within 5 seconds.
- **Reliability**: 99% uptime; auto-reconnect on lost connections.
- **Security**: Validate all inputs; enforce owner/admin permissions; secure pairing endpoint (future basic auth or IP whitelist); sanitize user inputs to prevent crashes.
- **Usability**: Clear, user-friendly error messages; interactive menus for discovery; concise help text.
- **Maintainability**: Modular code organization; centralized config; consistent code style; comprehensive logging.
- **Scalability (v2)**: Data layer abstracted to allow database swap (e.g., SQLite, MongoDB).

## 7. Constraints & Assumptions

- **WhatsApp Limitations**: Subject to WhatsApp Web rate limits and detection policies.
- **Environment**: Node.js environment with file system access; public internet access for pairing.
- **Scale**: Designed for small to medium-sized groups (up to WhatsApp’s limit).
- **Single Instance**: v1 assumes one bot instance per phone number.
- **Configuration**: Owner provides valid WhatsApp number and environment variables for config.

## 8. Known Issues & Potential Pitfalls

- **JSON File Concurrency**: Risk of data corruption on simultaneous writes. Mitigation: implement file locks or migrate to a lightweight database (SQLite) in v2.
- **API Rate Limits**: WhatsApp may block excessive requests. Mitigation: implement exponential backoff and per-user rate-limiting.
- **Connection Drops**: Unhandled socket closures could crash the bot. Mitigation: strengthen auto-reconnect logic and wrap connection code in try/catch.
- **Input Validation Gaps**: Missing checks can cause crashes (e.g., invalid phone numbers). Mitigation: rigorous validation with clear error feedback.
- **Pairing Endpoint Security**: Currently open to anyone on the network. Mitigation: restrict IP or add simple auth headers.
- **Lack of Automated Tests**: Increases regression risk. Mitigation: plan for a test suite in v2.

---
This PRD serves as the definitive guide for building, maintaining, and extending the Liviaa🌷 WhatsApp bot. All subsequent technical documents—Tech Stack details, Frontend/Backend structure, API specs—should adhere strictly to these requirements to ensure consistency and completeness.