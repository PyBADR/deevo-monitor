// Deevo Monitor — Tauri 2 Desktop Application
// Wraps the web frontend in a native window with Node.js sidecar for the API server.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .run(tauri::generate_context!())
        .expect("error while running deevo-monitor desktop app");
}
