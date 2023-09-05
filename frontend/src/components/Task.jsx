import { useState } from 'react';

function Task({ task, onUpdate, onDelete }) {
  const [openModal, setOpenModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
  });

  //update task and modal functions
  const handleChange = (event) => {
    setTaskForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdate = () => {
    setUpdateModal(true);
  };

  const handleUpdateModal = () => {
    const updatedTask = {
      ...task,
      title: taskForm.title,
      description: taskForm.description,
    };
    onUpdate(updatedTask);
    setUpdateModal(false);

    setTaskForm({
      title: '',
      description: '',
    });
  };

  const handleUpdateCancel = () => {
    setUpdateModal(false);
  };

  //delete task and modal functions
  const handleDelete = () => {
    setOpenModal(true);
  };

  const handleModalDelete = () => {
    setOpenModal(false);
    onDelete(task._id);
  };

  const handleModalCancel = () => {
    setOpenModal(false);
  };

  return (
    <div className="tasks">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <div className="task-button">
        <button onClick={handleUpdate} className="btn btn-block">
          Update
        </button>
        <button onClick={handleDelete} className="btn btn-block">
          Delete
        </button>
      </div>
      {/* delete modal */}
      {openModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Confirm Deletion: </h4>
            <p>Are you done with this task?</p>
            <div className="modal-buttons">
              <button onClick={handleModalDelete} className="btn btn-red">
                Yes
              </button>
              <button onClick={handleModalCancel} className="btn btn-gray">
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* update modal */}
      {updateModal && (
        <div className="modal update-modal">
          <div className="modal-content">
            <div className="form-group">
              <h2>Update Task</h2>
              <label>
                <b>New title:</b>
              </label>
              <form>
                <input
                  className="form-control"
                  type="text"
                  id="title"
                  name="title"
                  value={taskForm.title}
                  placeholder="New title..."
                  autoComplete="off"
                  onChange={handleChange}
                />
                <label>
                  <b>New description:</b>
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="description"
                  name="description"
                  value={taskForm.description}
                  placeholder="New description..."
                  autoComplete="off"
                  onChange={handleChange}
                />
              </form>
            </div>
            <div className="modal-buttons">
              <button
                onClick={handleUpdateModal}
                className="btn btn-green update-btn"
              >
                Submit
              </button>
              <button
                onClick={handleUpdateCancel}
                className="btn btn-gray update-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task;
