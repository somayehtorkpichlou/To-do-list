const input = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");

// load saved tasks
window.addEventListener("load", function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => {
    createTask(task.text, task.done, task.createdAt, task.updatedAt);
  });
});

// save tasks to localStorage
function saveTasks() {
  const allTasks = [];
  document.querySelectorAll("#todo-list li").forEach(li => {
    const text = li.querySelector(".task-text").textContent;
    const done = li.classList.contains("done");
    const createdAt = li.dataset.createdAt;
    const updatedAt = li.dataset.updatedAt;
    allTasks.push({ text, done, createdAt, updatedAt });
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// create a new task
function createTask(taskText, isDone = false, createdAt = null, updatedAt = null) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = taskText;
  span.classList.add("task-text");

  const timestamps = document.createElement("small");
  timestamps.classList.add("timestamps");

  const now = new Date();
  const createdTime = createdAt || now.toISOString();
  const updatedTime = updatedAt || createdTime;

  timestamps.textContent = `ثبت: ${new Date(createdTime).toLocaleString()} | ویرایش: ${new Date(updatedTime).toLocaleString()}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.classList.add("delete-btn");

  li.appendChild(span);
  li.appendChild(timestamps);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);

  if (isDone) li.classList.add("done");

  // marked done
  span.addEventListener("click", function () {
    li.classList.toggle("done");
    saveTasks();
  });

  // delete
  deleteBtn.addEventListener("click", function () {
    li.classList.add("fade-out");
    setTimeout(() => {
      li.remove();
      saveTasks();
    }, 300);
  });

  // edit
  span.addEventListener("dblclick", function () {
    const currentText = span.textContent;
    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = currentText;
    inputEdit.classList.add("edit-input");

    li.replaceChild(inputEdit, span);
    inputEdit.focus();

    function saveEdit() {
      const newText = inputEdit.value.trim();
      if (newText !== "") {
        const newUpdatedTime = new Date().toISOString();
        span.textContent = newText;
        li.replaceChild(span, inputEdit);
        timestamps.textContent = `ثبت: ${new Date(createdTime).toLocaleString()} | ویرایش: ${new Date(newUpdatedTime).toLocaleString()}`;
        li.dataset.updatedAt = newUpdatedTime;
        saveTasks();
      } else {
        li.remove();
        saveTasks();
      }
    }

    inputEdit.addEventListener("keypress", function (e) {
      if (e.key === "Enter") saveEdit();
    });

    inputEdit.addEventListener("blur", saveEdit);
  });

  li.dataset.createdAt = createdTime;
  li.dataset.updatedAt = updatedTime;
}

// add task with button
addButton.addEventListener("click", function () {
  const taskText = input.value.trim();
  if (taskText === "") return;

  createTask(taskText);
  saveTasks();
  input.value = "";
});

// add task with enter key
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addButton.click();
  }
});
