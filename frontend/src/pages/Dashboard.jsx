import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import Task from "../components/Task";
import Welcome from "../components/Welcome";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const URL = import.meta.env.VITE_REACT_API_URL;

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = await response.json();

      setTasks(data);

      console.log(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //handle submit
  const handleTaskSubmit = async (title, description) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (response.ok) {
        const { data } = await response.json();

        console.log("Task created successfully", data);

        setTasks((prevTasks) => [...prevTasks, data]);
      } else {
        console.error("Failed to create the task", response.status);
      }
    } catch (error) {
      console.error("Failed to create a task", error);
    }
  };

  // handle update
  const handleTaskUpdate = async (taskId, updatedTask) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const { data } = await response.json();
        console.log("Task updated successfully", data);
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === taskId ? data : task))
        );
      } else {
        console.error("Failed to update the task", response.status);
      }
    } catch (error) {
      console.error("Failed to update a task", error);
    }
  };

  // handle delete
  const handleTaskDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Task deleted successfully");
        console.log(`Deleted task ID: ${taskId}`);
        setTasks(tasks.filter((task) => task._id !== taskId));
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Welcome />
      <h2>Tasks Dashboard</h2>

      <TaskForm onTaskSubmit={handleTaskSubmit} />

      <div className="task-list">
        <ul>
          {tasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              onUpdate={(updatedTask) =>
                handleTaskUpdate(task._id, updatedTask)
              }
              onDelete={() => handleTaskDelete(task._id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
