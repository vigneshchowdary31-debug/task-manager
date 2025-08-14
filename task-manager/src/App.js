import React, { useState } from "react";
import "./App.css";

// Task Card Component
function TaskCard({ title, desc, priority, deadline, onRemove, onMoveToProgress, onMoveToDone, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const priorityColors = {
    High: "#ff4d4f",
    Low: "#fadb14",
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <span
          className="priority"
          style={{ background: priorityColors[priority] || "#d9d9d9" }}
        >
          {priority}
        </span>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>⋮</button>
        {menuOpen && (
          <div className="menu">
            <button onClick={onEdit}>🖊️ Edit</button>
            <button onClick={onRemove}>🗑 Remove</button>
            <button onClick={onMoveToProgress}>➡ Move to On Progress</button>
            <button onClick={onMoveToDone}>✅ Move to Done</button>
          </div>
        )}
      </div>

      <h3>{title}</h3>
      <p>{desc}</p>
      <p><strong>Deadline:</strong> {deadline}</p>
    </div>
  );
}

// Popup Component
function Popup({ message, onClose }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <span className="checkmark">✔</span>
        <p>{message}</p>
        <button onClick={onClose}>Back</button>
      </div>
    </div>
  );
}

// Add Task Form Component
function AddTaskForm({ onSubmit, onClose }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, desc, priority, deadline });
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Add New Task</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <div style={{ marginTop: "10px" }}>
            <button type="submit">Add Task</button>
            <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [tasks, setTasks] = useState({ todo: [], progress: [], done: [] });
  const [popupVisible, setPopupVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Add Task
  const handleAddTask = (task) => {
    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, task]
    }));
    setShowForm(false);
    setPopupVisible(true);
  };

  // Edit Task
  const editTask = (column, index) => {
    const currentTask = tasks[column][index];
    const title = prompt("Edit Task Title:", currentTask.title) || currentTask.title;
    const desc = prompt("Edit Task Description:", currentTask.desc) || currentTask.desc;
    const priority = prompt("Edit Priority (High, Low):", currentTask.priority) || currentTask.priority;
    const deadline = prompt("Edit Deadline (DD-MM-YYYY):", currentTask.deadline) || currentTask.deadline;

    setTasks((prev) => {
      const updated = { ...prev };
      updated[column][index] = { title, desc, priority, deadline };
      return updated;
    });
  };

  // Remove Task
  const removeTask = (column, index) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].filter((_, i) => i !== index)
    }));
  };

  // Move Task
  const moveTask = (fromColumn, index, toColumn) => {
    const task = tasks[fromColumn][index];
    setTasks((prev) => {
      const updated = { ...prev };
      updated[fromColumn] = updated[fromColumn].filter((_, i) => i !== index);
      updated[toColumn] = [...updated[toColumn], task];
      return updated;
    });
  };

  return (
    <div>
      {/* Add Task Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px" }}>
        <button className="add-btn" onClick={() => setShowForm(true)}>+ Add Task</button>
      </div>

      {/* side board */}

      <div className="sidebar">
        <div className="stat-box">
          <h3>All Active Tasks</h3>
          <p>{tasks.todo.length + tasks.progress.length}</p>
        </div>
        <div className="stat-box">
          <h3>Task To Do</h3>
          <p>{tasks.todo.length}</p>
        </div>
        <div className="stat-box">
          <h3>Completed Tasks</h3>
          <p>{tasks.done.length}/{tasks.todo.length + tasks.progress.length + tasks.done.length}</p>
        </div>
      </div>

      {/* Task Board */}
      <div className="board">
        <Column title="To Do" color="purple" tasks={tasks.todo} columnKey="todo" removeTask={removeTask} moveTask={moveTask} editTask={editTask} />
        <Column title="On Progress" color="orange" tasks={tasks.progress} columnKey="progress" removeTask={removeTask} moveTask={moveTask} editTask={editTask} />
        <Column title="Done" color="green" tasks={tasks.done} columnKey="done" removeTask={removeTask} moveTask={moveTask} editTask={editTask} />
      </div>

      {/* Popup Confirmation */}
      {popupVisible && <Popup message="New task has been created successfully" onClose={() => setPopupVisible(false)} />}

      {/* Add Task Form */}
      {showForm && <AddTaskForm onSubmit={handleAddTask} onClose={() => setShowForm(false)} />}
    </div>
  );
}

// Column Component
function Column({ title, color, tasks, columnKey, removeTask, moveTask, editTask }) {
  return (
    <div className="column">
      <h2 style={{ borderBottom: `2px solid ${color}` }}>{title}</h2>
      {tasks.map((task, index) => (
        <TaskCard
          key={index}
          {...task}
          onEdit={() => editTask(columnKey, index)}
          onRemove={() => removeTask(columnKey, index)}
          onMoveToProgress={() => moveTask(columnKey, index, "progress")}
          onMoveToDone={() => moveTask(columnKey, index, "done")}
        />
      ))}
    </div>
  );
}

export default App;
