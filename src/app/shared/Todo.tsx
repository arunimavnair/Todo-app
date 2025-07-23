"use client";

import {
  CheckCircleIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

interface Task {
  _id: string;
  title: string;
  description?: string;
  complete: boolean;
}

export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const inputBox = useRef<HTMLInputElement>(null);
  const [taskCount, setTaskCount] = useState(0);

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    setTaskCount(tasks.length);
  }, [tasks]);

  async function getTasks() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.freeapi.app/api/v1/todos", {
        method: "GET",
        headers: { accept: "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const result = await response.json();
      setTasks(result.data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(): Promise<void> {
    if (!inputBox.current) return;
    const task = inputBox.current.value.trim();
    if (!task) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.freeapi.app/api/v1/todos/", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: task,
          description: "Task created via Todo App",
        }),
      });
      if (!response.ok) throw new Error("Failed to add task");
      inputBox.current.value = "";
      await getTasks();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTask(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.freeapi.app/api/v1/todos/${id}`, {
        method: "DELETE",
        headers: { accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete task");
      await getTasks();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function markComplete(id: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.freeapi.app/api/v1/todos/toggle/status/${id}`,
        {
          method: "PATCH",
          headers: { accept: "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to toggle task status");
      await getTasks();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="m-6 md:m-20 grid grid-flow-row auto-rows-max gap-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 drop-shadow pb-2">
        TODO APP
      </h1>

      <p className="text-lg text-center text-gray-700">
        Total Tasks: <span className="font-bold">{taskCount}</span>
      </p>

      {/* Show loading or error */}
      {loading && (
        <p className="text-center text-blue-600 font-semibold">Loading...</p>
      )}
      {error && (
        <p className="text-center text-red-600 font-semibold">Error: {error}</p>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        <input
          className="p-3 w-full md:w-1/2 rounded-lg shadow-md border border-blue-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          type="text"
          placeholder="Enter task"
          ref={inputBox}
          disabled={loading}
        />
        <button
          className="bg-blue-600 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={addTask}
          disabled={loading}
        >
          Add Task
        </button>
      </div>

      <ul className="grid gap-4 mt-6">
        {tasks.map((task) => (
          <li key={task._id}>
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-all">
              <div className="flex items-center gap-3">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />
                <span
                  className={`text-lg font-medium ${
                    task.complete
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <div className="flex gap-2">
                <CheckCircleIcon
                  className={`h-6 w-6 cursor-pointer ${
                    task.complete ? "text-green-500" : "text-gray-400"
                  } hover:text-green-700`}
                  title="Mark complete"
                  onClick={() => markComplete(task._id)}
                />
                <TrashIcon
                  className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
                  title="Delete task"
                  onClick={() => deleteTask(task._id)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
