// const
const filters = document.querySelectorAll(".filter");
const addTodoBtn = document.getElementById("add-todo");
const todoList = document.getElementById("todo-list");
const addTaskContainer = document.querySelector(".add-task-container");
const overlay = document.querySelector(".overlay");
const taskInput = document.getElementById("add-task-input");
const addTaskBtn = document.getElementById("add-task-btn");

// vars
let todos = [];
let currentFilter = "all";

addTodoBtn.addEventListener("click", () => {
  addTaskContainer.classList.remove("hidden");
  taskInput.focus();
});

overlay.addEventListener("click", () => {
  addTaskContainer.classList.add("hidden");
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && taskInput.value.trim()) addTodoFunc(taskInput.value);
});

addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim()) addTodoFunc(taskInput.value);
});

function addTodoFunc(text) {
  taskInput.value = "";
  addTaskContainer.classList.add("hidden");

  const todo = {
    id: Date.now(),
    text,
    completed: false,
  };

  todos.push(todo);

  saveTodos();
  renderTodos();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  if (!todos) return

  todoList.innerHTML = '';

  const filteredTodos = getTodos();

  filteredTodos.forEach((todo) => {

    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");

    const labelEl = document.createElement("label");
    labelEl.setAttribute("for", `checkbox-${todo.id}`);

    const checkboxContainerEl = document.createElement("div");
    checkboxContainerEl.classList.add("checkbox-container");

    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.id = `checkbox-${todo.id}`;
    checkboxInput.classList.add("checkbox-input");
    checkboxInput.checked = todo.completed;
    checkboxInput.addEventListener("change", () => toggleTodo(todo.id))

    const checkboxEl = document.createElement("div");
    checkboxEl.classList.add("checkbox");
    const iconEl = document.createElement("i");
    iconEl.classList.add("fa-solid", "fa-check");

    checkboxEl.appendChild(iconEl);

    checkboxContainerEl.appendChild(checkboxInput);
    checkboxContainerEl.appendChild(checkboxEl);

    const textEl = document.createElement("div");
    textEl.classList.add("task-text");
    textEl.textContent = todo.text;

    labelEl.appendChild(checkboxContainerEl);
    labelEl.appendChild(textEl);

    const deleteBox = document.createElement("div");
    deleteBox.classList.add("trash-icon");
    deleteBox.id = "delete-btn";

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash");

    deleteBox.appendChild(deleteIcon);
    deleteBox.addEventListener("click", () => removeTask(todo.id))

    todoItem.appendChild(labelEl);
    todoItem.appendChild(deleteBox);
    if (todo.completed) todoItem.classList.add("completed");
    
    todoList.appendChild(todoItem);
    
    setTimeout(() => todoItem.classList.add("show"), 10);
  })
  
}


filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((filter2) => {
      filter2.classList.remove("active");
    });

    filter.classList.add("active");
    currentFilter = filter.dataset.filter;
    renderTodos();
  });

});


function getTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter(todo => !todo.completed);
    case "completed":
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}


function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return {...todo, completed: !todo.completed}
    }

    return todo
  });
  saveTodos();
  renderTodos();
}

function removeTask(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
})

function loadTodos() {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
  renderTodos();
}