// Dynamic Interview Preparation Tracker using DOM manipulation, localStorage persistence, and event listeners.
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const totalTasks = document.querySelector("#totalTasks");
const completedTasks = document.querySelector("#completedTasks");
const pendingTasks = document.querySelector("#pendingTasks");
const progressLabel = document.querySelector("#progressLabel");
const progressBar = document.querySelector("#progressBar");
const filterButtons = document.querySelectorAll("[data-task-filter]");
const clearCompletedButton = document.querySelector("#clearCompletedButton");

const STORAGE_KEY = "intervoxaTasks";

const defaultTasks = [
  { id: crypto.randomUUID(), title: "Learn HTML & CSS Layouts", completed: true },
  { id: crypto.randomUUID(), title: "Practice Java Data Structures", completed: false },
  { id: crypto.randomUUID(), title: "Mock Behavioral & STAR Round", completed: true },
  { id: crypto.randomUUID(), title: "Resume Technical Project Pitch", completed: false },
];

let activeFilter = "all";

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultTasks;
  } catch {
    return defaultTasks;
  }
}

let tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn("Unable to save tasks to localStorage:", error);
  }
}

function updateCounters() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (totalTasks) totalTasks.textContent = total;
  if (completedTasks) completedTasks.textContent = completed;
  if (pendingTasks) pendingTasks.textContent = pending;
  if (progressLabel) progressLabel.textContent = `${progress}% complete`;
  if (progressBar) progressBar.style.width = `${progress}%`;
}

function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = `task-item${task.completed ? " is-completed" : ""}`;
  item.dataset.taskId = task.id;

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "task-toggle";
  toggleButton.setAttribute("aria-label", `Mark ${task.title} as ${task.completed ? "pending" : "completed"}`);
  toggleButton.textContent = task.completed ? "✓" : "";

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-task";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete ${task.title}`);

  item.append(toggleButton, title, deleteButton);
  return item;
}

function getFilteredTasks() {
  if (activeFilter === "pending") {
    return tasks.filter((task) => !task.completed);
  }
  if (activeFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }
  return tasks;
}

function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = "";

  const filtered = getFilteredTasks();

  if (filtered.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.className = "task-empty";
    emptyMsg.textContent = activeFilter === "all" ? "No preparation tasks yet. Add one above!" : `No ${activeFilter} tasks found.`;
    taskList.append(emptyMsg);
  } else {
    filtered.forEach((task) => {
      taskList.append(createTaskElement(task));
    });
  }

  updateCounters();
}

function addTask(title) {
  tasks.push({
    id: crypto.randomUUID(),
    title,
    completed: false,
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find((currentTask) => currentTask.id === id);

  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    saveTasks();
    renderTasks();
  }
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

taskForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();

  if (!title) {
    taskInput.focus();
    return;
  }

  addTask(title);
  taskInput.value = "";
  taskInput.focus();
});

taskList?.addEventListener("click", (event) => {
  const target = event.target;
  const taskItem = target.closest(".task-item");

  if (!taskItem) {
    return;
  }

  if (target.classList.contains("task-toggle")) {
    toggleTask(taskItem.dataset.taskId);
  }

  if (target.classList.contains("delete-task")) {
    deleteTask(taskItem.dataset.taskId);
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.taskFilter || "all";
    renderTasks();
  });
});

clearCompletedButton?.addEventListener("click", clearCompleted);

renderTasks();
