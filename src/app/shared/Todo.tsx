"use client";

import {
  CheckCircleIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

export default function Todo() {
  const [tasks, setTasks] = useState<any[]>([]);
  const inputBox = useRef<any>(null);
  const [taskCount, setTaskCount] = useState(0);


  useEffect(() => {
    getTasks();
  }, []);

  
  useEffect(() => {
    setTaskCount(tasks.length);
  }, [tasks]);

  
  async function getTasks() {
    const url = "https://api.freeapi.app/api/v1/todos";
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setTasks(result.data);
    } catch (error) {
      console.error("Fetch tasks error:", error);
    }
  }

  
  async function addTask(): Promise<void> {
    const task = inputBox.current.value.trim();
    if (!task) return;

    const url = "https://api.freeapi.app/api/v1/todos/";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: task,
        description: "Task created via Todo App",
      }),
    };

    try {
      await fetch(url, options);
      inputBox.current.value = "";
      getTasks(); 
    } catch (error) {
      console.error("Add task error:", error);
    }
  }

  
  async function deleteTask(id: string) {
    const url = `https://api.freeapi.app/api/v1/todos/${id}`;
    const options = {
      method: "DELETE",
      headers: { accept: "application/json" },
    };

    try {
      const res = await fetch(url, options);
      const result = await res.json();
      console.log("Deleted:", result);
      getTasks(); 
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  
  async function markComplete(id: string) {
   

const url = 'https://api.freeapi.app/api/v1/todos/toggle/status/648e0c0722147847623e0a00';
const options = {method: 'PATCH', headers: {accept: 'application/json'}};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
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

      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        <input
          className="p-3 w-full md:w-1/2 rounded-lg shadow-md border border-blue-300 text-white-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          type="text"
          placeholder="Enter task"
          ref={inputBox}
        />
        <button
          className="bg-blue-600 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
          onClick={addTask}
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
                    task.complete ? "line-through text-gray-400" : "text-gray-800"
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
                  onClick={() => markComplete(task.title)}
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
