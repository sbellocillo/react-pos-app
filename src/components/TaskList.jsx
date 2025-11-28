import { useState } from 'react';
import axios from 'axios';

const TaskList = ({ title, initialTasks }) => {
  const [tasks, setTasks] = useState(() =>
    initialTasks.map((task, index) => ({ ...task, id: index + 1 }))
  );
  const [newTaskText, setNewTaskText] = useState('');

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      const newTask = {
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        text: newTaskText.trim(),
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const percentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="progress-card">
      <h3>{title}</h3>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="progress-text">
          <span>{completedCount} of {tasks.length} tasks completed</span>
          <span className="progress-percentage">{Math.round(percentage)}%</span>
        </div>
      </div>
      
      <div style={{ marginTop: '1.5rem' }}>
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <div 
              className={`task-checkbox ${task.completed ? 'checked' : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              {task.completed && '✓'}
            </div>
            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={addTask} className="add-task-form">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="add-task-input"
        />
        <button type="submit" className="add-task-button">
          Add
        </button>
      </form>
    </div>
  );
};

export default TaskList;