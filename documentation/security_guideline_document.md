# Security Guidelines for "Liviaa🌷" WhatsApp Bot (Check-V1)

## Table of Contents
1. Introduction
2. Core Security Principles
3. Threat Model & Scope
4. Authentication & Access Control
5. Input Handling & Validation
6. Data Protection & Secrets Management
7. Pairing HTTP Endpoint Security
8. Configuration & Deployment Hardening
9. Logging, Monitoring & Incident Response
10. Dependency Management & Updates
11. Secure Development Best Practices

---

## 1. Introduction
This document provides actionable security guidelines tailored to the "Liviaa🌷" WhatsApp bot codebase (Check-V1). It aligns with security-by-design and defense-in-depth principles to help you mitigate risks across authentication, input processing, data protection, configuration, and more.

## 2. Core Security Principles
- Security by Design: Embed security from initial design through deployment.  
- Least Privilege: Grant each module or process only the permissions it absolutely needs.  
- Defense in Depth: Layer controls so failures in one do not compromise the system.  
- Fail Securely: Ensure errors don’t leak sensitive data or leave the bot in an insecure state.  
- Secure Defaults: Default configurations must favor security over convenience.

## 3. Threat Model & Scope
**Assets:** WhatsApp session credentials, user data (IDs, phone numbers), group settings, bot owner commands.  
**Adversaries:** Malicious group members, external attackers targeting the HTTP pairing endpoint, supply-chain attacks via dependencies.  
**Risks:** Unauthorized access or control of the bot, data tampering or leakage, denial-of-service, injection of malicious commands.

## 4. Authentication & Access Control
- **Owner Authentication:**  
  • Enforce owner-only commands (`restart`, `shutdown`, `backup`, etc.) via robust checks in `lib/permission.js`.  
  • Store owner numbers in environment variables (not in `config.js`).
- **Group Admin Enforcement:**  
  • Validate `requireAdmin` and `requireOwner` at runtime for each sensitive group command.  
  • On demotion or removal, revoke any outstanding command contexts for that user.
- **Session Management:**  
  • Use `@yemobyte/ye-bail` multi-file auth state securely; protect session files with OS file permissions (`0600`).  
  • Rotate session keys periodically and invalidate old sessions on redeploy.

## 5. Input Handling & Validation
- **Command Parsing:**  
  • Within `lib/handler.js`, validate command prefixes strictly (no ambiguous patterns).  
  • Sanitize user inputs (phone numbers, group names, descriptions) using a validator (e.g., `validator.js`).
- **Prevent Injection:**  
  • Avoid constructing dynamic code or file paths from user input.  
  • If future features parse user-generated JSON, enforce strict JSON schema validation.
- **Anti-Spam/Rate Limits:**  
  • Enhance the basic throttle to per-user sliding window rate limiting (e.g., 1 command/2s).  
  • On repeated violations, automatically mute or temporarily block the user.

## 6. Data Protection & Secrets Management
- **Secrets Storage:**  
  • Move all API keys, WhatsApp session secrets, owner numbers into environment variables or a secrets manager (Vault, AWS Secrets Manager).  
  • Never commit `auth_info_multi.json` or backups into version control.
- **Encryption at Rest:**  
  • For any sensitive data in JSON files, consider encrypting the file contents using AES-256-GCM with a key from an environment variable.  
  • Protect backup files on disk with strict OS permissions and optional encryption.
- **In Transit:**  
  • For the `/pair` endpoint on the HTTP server, enforce HTTPS/TLS (use valid certificates).

## 7. Pairing HTTP Endpoint Security
- **Authentication:**  
  • Introduce a one-time pairing token or basic auth to protect `/pair`.  
  • Store the token as an environment variable and rotate it periodically.
- **Rate Limiting & Throttling:**  
  • Apply IP-based rate limits (e.g., max 5 pairing attempts per minute) via middleware (e.g., `express-rate-limit`).
- **Input Validation:**  
  • Validate all request parameters strictly (no unexpected query fields).  
  • Sanitize any data written to disk from pairing requests.
- **Logging & Monitoring:**  
  • Log pairing attempts (timestamp, IP, success/failure) to a secure log store.  
  • Alert on unusual pairing patterns (e.g., repeated failures).

## 8. Configuration & Deployment Hardening
- **Environment Segregation:**  
  • Use separate configs for development, staging, and production.  
  • Enable debug logs only in non-production environments.
- **Secure Defaults:**  
  • In `config.js`, default `public` mode to `false` unless explicitly set.  
  • Default file-based DB directory with restrictive permissions and outside the webroot.
- **OS & Container Hardening:**  
  • Run the bot process under a non-root user.  
  • Disable unused ports and services on the host.  
  • Ensure file system mounts are read-only when possible.

## 9. Logging, Monitoring & Incident Response
- **Structured Logging:**  
  • Enhance `pino` usage with JSON logs that include user ID, command name, outcome, and timestamps.  
  • Separate log levels (info, warn, error) and mask PII.
- **Log Retention & Rotation:**  
  • Rotate logs daily and purge after a configurable retention period.  
  • Store critical logs in a centralized, tamper-evident system.
- **Alerts & Dashboards:**  
  • Integrate with an alerting system (PagerDuty, Slack) for high-severity events (e.g., multiple failed pairing attempts).

## 10. Dependency Management & Updates
- **Lockfiles & Audits:**  
  • Commit `package-lock.json` and run `npm audit` regularly.  
  • Integrate a SCA tool (e.g., Dependabot, Snyk) to detect new vulnerabilities.
- **Vet Third-Party Packages:**  
  • Periodically review `@yemobyte/ye-bail` fork for upstream security patches.  
  • Remove unused dependencies to reduce attack surface.

## 11. Secure Development Best Practices
- **Code Reviews & Pair Programming:**  
  • Enforce peer reviews with a security checklist for each PR.  
  • Highlight changes to permission checks, input parsing, and new endpoints.
- **Automated Testing:**  
  • Write unit tests for all command handlers, especially edge cases for invalid inputs.  
  • Include security-focused tests (e.g., rate limit enforcement, permission denial scenarios).
- **Continuous Integration & Delivery (CI/CD):**  
  • Embed static analysis (ESLint, security linters) and unit tests in CI.  
  • Deploy only when all security and test checks pass.
- **Documentation & Training:**  
  • Maintain an up-to-date security section in the README.  
  • Provide onboarding for new contributors covering these guidelines.

---

By following these guidelines, you ensure that **Liviaa🌷** remains robust, maintainable, and secure against evolving threats across its WhatsApp integration and auxiliary services.