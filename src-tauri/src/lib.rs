// Deevo Monitor — Tauri 2 Desktop App
// GCC Intelligence Dashboard with system tray, notifications, and local AI

use tauri::Manager;

#[tauri::command]
fn get_app_info() -> serde_json::Value {
    serde_json::json!({
        "name": "Deevo Monitor",
        "version": "1.0.0",
        "author": "BDRAI",
        "platform": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
    })
}

#[tauri::command]
async fn check_ollama_status() -> Result<serde_json::Value, String> {
    let client = reqwest::Client::new();
    match client.get("http://localhost:11434/api/tags").send().await {
        Ok(resp) => {
            if resp.status().is_success() {
                let body: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;
                Ok(serde_json::json!({
                    "status": "online",
                    "models": body.get("models").cloned().unwrap_or(serde_json::json!([]))
                }))
            } else {
                Ok(serde_json::json!({"status": "error", "code": resp.status().as_u16()}))
            }
        }
        Err(_) => Ok(serde_json::json!({"status": "offline"})),
    }
}

#[tauri::command]
async fn generate_ai_insight(prompt: String, model: Option<String>) -> Result<String, String> {
    let client = reqwest::Client::new();
    let model = model.unwrap_or_else(|| "llama3.2:3b".to_string());

    let body = serde_json::json!({
        "model": model,
        "prompt": prompt,
        "stream": false
    });

    match client.post("http://localhost:11434/api/generate")
        .json(&body)
        .send()
        .await
    {
        Ok(resp) => {
            let data: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;
            Ok(data.get("response").and_then(|v| v.as_str()).unwrap_or("").to_string())
        }
        Err(e) => Err(format!("Ollama unavailable: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            get_app_info,
            check_ollama_status,
            generate_ai_insight,
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_title("Deevo Monitor — GCC Intelligence Dashboard").unwrap();

            #[cfg(debug_assertions)]
            window.open_devtools();

            println!("Deevo Monitor desktop app started");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Deevo Monitor");
}
