---
trigger: always_on
---

# Project Rules — BetterRTX Installer (Tauri v2)

- Use **Tauri v2** APIs and docs; prefer NSIS installer on Windows.
- Frontend: React + TS; strict mode; Tailwind CSS v4; keep UI edits isolated. Reference Tailwind @docs
- Rust core: small commands with `#[tauri::command]`; pure helpers.