const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const networkStatus = document.getElementById("networkStatus");

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // If no tasks saved, add default examples
  if (tasks.length === 0) {
    tasks = [
      { text: "Pay Electricity Bill", dueDate: "2025-07-15", done: false },
      { text: "Buy Groceries for Weekend", dueDate: "2025-07-13", done: false },
      { text: "Submit TAP Invest Assignment", dueDate: "2025-07-15", done: false }
    ];
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = createTaskElement(task, index);
    taskList.appendChild(li);
    observeVisibility(li);
  });
}

function createTaskElement(task, index) {
  const li = document.createElement("li");
  if (task.done) li.classList.add("done");

  li.innerHTML = `
    <strong>${task.text}</strong> <br/>
    <small>Due: ${task.dueDate || 'No date'}</small>
    <div class="task-actions">
      <button class="done-btn" onclick="markDone(${index})">✔ Done</button>
      <button class="delete-btn" onclick="deleteTask(${index})">🗑 Delete</button>
    </div>
  `;
  return li;
}

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  if (text === "") return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, dueDate, done: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  dueDateInput.value = "";
  loadTasks();
}

function markDone(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks[index].done = !tasks[index].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

if ("requestIdleCallback" in window) {
  requestIdleCallback(() => {
    console.log("Auto-saved during idle");
    // Already using localStorage; nothing else needed here
  });
}

function updateNetworkStatus() {
  if ("connection" in navigator) {
    const conn = navigator.connection;
    networkStatus.textContent = `📶 Network: ${conn.effectiveType.toUpperCase()}`;
  } else {
    networkStatus.textContent = "📶 Network info not supported";
  }
}

function observeVisibility(element) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });
  observer.observe(element);
}

window.addEventListener("load", () => {
  updateNetworkStatus();
  loadTasks();
});