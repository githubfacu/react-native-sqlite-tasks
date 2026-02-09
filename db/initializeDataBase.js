import * as SQLite from "expo-sqlite";
import { Alert } from "react-native";

class TasksDatabase {
  constructor() {
    this.db = null;
  }

  async init() {
    this.db = await SQLite.openDatabaseAsync("tasksdb.db");

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      );
    `);
  }

  async getTasks() {
    if (!this.db) throw new Error("DB not initialized");
    return await this.db.getAllAsync("SELECT * FROM tasks");
  }

  async addTask(title) {
    if (!this.db) throw new Error("DB not initialized");

    if (!title || !title.trim()) {
      Alert.alert("Debe ingresar una tarea");
      return;
    }

    await this.db.runAsync("INSERT INTO tasks (title) VALUES (?);", [title]);
  }

  async deleteTask(id) {
    if (!this.db) throw new Error("DB not initialized");

    await this.db.runAsync("DELETE FROM tasks WHERE id = ?;", [id]);
  }

  async toggleCompleteTask(id, completed) {
    if (!this.db) throw new Error("DB not initialized");

    const newCompleted = completed ? 0 : 1;

    await this.db.runAsync("UPDATE tasks SET completed = ? WHERE id = ?;", [
      newCompleted,
      id,
    ]);
  }
}

export default new TasksDatabase();
