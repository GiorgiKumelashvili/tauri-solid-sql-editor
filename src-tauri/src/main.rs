#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Menu;

// Our Tauri Command
#[tauri::command]
fn return_string(word: String) -> String {
    return word;
}

#[tauri::command]
fn my_custom_command() -> String {
    println!("I was invoked from JS!");
    return "asd".to_string();
}

fn main() {
    let menu = Menu::new(); // configure the menu

    tauri::Builder::default()
        .menu(menu)
        .invoke_handler(tauri::generate_handler![return_string, my_custom_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
