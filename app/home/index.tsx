import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TasksDB from "../../db/initializeDataBase";

interface Task {
  title: string;
  id: number;
  completed: boolean;
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await TasksDB.init();
    loadTasks();
  };

  const loadTasks = async () => {
    const data = await TasksDB.getTasks();
    setTasks(data);
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) {
      Alert.alert("Escribí una tarea primero ✍️");
      return;
    }

    await TasksDB.addTask(newTask);
    setNewTask("");
    loadTasks();
  };

  const handleDelete = async (id: number) => {
    await TasksDB.deleteTask(id);
    loadTasks();
  };

  const handleToggle = async (id: number, completed: boolean) => {
    await TasksDB.toggleCompleteTask(id, completed);
    loadTasks();
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View className="flex-row items-center justify-between bg-white p-2 mb-3 rounded-2xl shadow">
      <TouchableOpacity
        onPress={() => handleToggle(item.id, item.completed)}
        className="flex-row items-center flex-1 p-2"
      >
        <Ionicons
          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={item.completed ? "#22c55e" : "#9ca3af"}
        />

        <Text
          className={`ml-3 text-base ${
            item.completed ? "line-through text-gray-500" : "text-gray-900"
          }`}
        >
          {item.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-2">
        <Ionicons name="trash-outline" size={24} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      className="flex-1 bg-gray-100 px-4"
      style={{ paddingTop: Platform.OS === "android" ? 55 : 0 }}
    >
      <Text className="text-3xl font-bold text-blue-800 mb-6 mt-2">
        Mis Tareas
      </Text>

      {/* Input nueva tarea */}
      <View className="flex-row items-center mb-6">
        <TextInput
          placeholder="Nueva tarea..."
          value={newTask}
          onChangeText={setNewTask}
          className="flex-1 text-lg bg-white p-4 rounded-l-2xl border border-gray-200"
        />

        <TouchableOpacity
          onPress={handleAddTask}
          className="bg-blue-600 p-4 rounded-r-2xl"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text className="text-center text-gray-600 mt-10">
            No hay tareas todavía 💤
          </Text>
        }
      />
    </View>
  );
}
