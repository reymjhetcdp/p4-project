import { useState } from 'react';

function TaskForm({ onTaskSubmit }) {
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
  });

  const handleChange = (event) => {
    setTaskForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { title, description } = taskForm;
    onTaskSubmit(title, description);

    setTaskForm({
      title: '',
      description: '',
    });

    alert('Task created successfully');
  };

  const { title, description } = taskForm;

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Task Title:</label>
        <input
          className="form-control"
          type="text"
          id="title"
          name="title"
          value={title}
          placeholder="Enter task name"
          autoComplete="off"
          onChange={handleChange}
        />
        <label>Description:</label>
        <input
          className="form-control"
          type="text"
          id="description"
          name="description"
          value={description}
          placeholder="Enter task description"
          autoComplete="off"
          onChange={handleChange}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-block">
            Create new task
          </button>
        </div>
      </div>
    </form>
  );
}

export default TaskForm;
