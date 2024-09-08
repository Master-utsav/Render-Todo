// DOM Elements
const addBtn = document.getElementById("task-btn");
const input = document.getElementById("task-input");
const parent = document.getElementById("todo-parent");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

let todos = [];

// Function to get the token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Function to set headers with the token
function getHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'token': `${token}`
    };
}

// Check if user is logged in
function checkAuth() {
    const token = getHeaders();
    if (token.token) {
        loginBtn.classList.add('hidden');
        signupBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        fetchTodos();
    } else {
        loginBtn.classList.remove('hidden');
        signupBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
    }
}

// Fetch all todos for the authenticated user
async function fetchTodos() {
    try {
        const response = await fetch("https://week6-todo-backend.onrender.com/todos/", {
            headers: getHeaders()
        });

        if (response.ok) {
            todos = await response.json();
            renderTodos(todos);
        } else {
            alert("Failed to fetch todos. Please log in.");
        }
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

// Handle adding a todo item
async function addItem() {
    const title = input.value.trim();

    if (title === "") {
        alert("Please enter a task");
        return;
    }

    try {
        const response = await fetch("https://week6-todo-backend.onrender.com/todos/add", {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ title }),
        });

        if (response.ok) {
            const newTodo = await response.json();
            todos.push(newTodo.todo);
            renderTodos(todos);
            input.value = "";
        } else {
            alert("Failed to add todo. Please try again.");
        }
    } catch (error) {
        console.error("Error adding todo:", error);
    }
}

// Handle deleting a todo item
async function deleteItem(id) {
    try {
        const response = await fetch(`https://week6-todo-backend.onrender.com/todos/delete/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });

        if (response.ok) {
            todos = todos.filter((todo) => todo.id !== id);
            renderTodos(todos);
        } else {
            alert("Failed to delete todo.");
        }
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
}

// Handle toggling the completion status of a todo
async function checkItem(id) {
    try {
        const response = await fetch(`https://week6-todo-backend.onrender.com/todos/update/${id}`, {
            method: "PATCH",
            headers: getHeaders()
        });

        if (response.ok) {
            todos = todos.map((todo) => 
                todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
            );
            renderTodos(todos);
        } else {
            alert("Failed to update todo status.");
        }
    } catch (error) {
        console.error("Error updating todo:", error);
    }
}

// Handle updating the text of a todo item
async function toggleEditItem(id) {
    const todo = todos.find((todo) => todo.id === id);

    if (todo.isEditing) {
        const titleInput = document.getElementById(`todo-title-${id}`);
        const newTitle = titleInput.value.trim();

        if (newTitle === "") {
            alert("Todo item cannot be empty.");
            titleInput.value = todo.title; // Restore the previous value
            return;
        }

        try {
            const response = await fetch(`https://week6-todo-backend.onrender.com/todos/updateText/${id}`, {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify({ title: newTitle }),
            });

            if (response.ok) {
                todo.title = newTitle;
            } else {
                alert("Failed to update todo.");
            }
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    }

    todo.isEditing = !todo.isEditing;
    renderTodos(todos);
}

// Render todos
function renderTodos(todos) {
    parent.innerHTML = "";
    todos.forEach((todo) => {
        parent.innerHTML += `
            <div id="todo-${todo.id}" class="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="todo-check-${todo.id}" ${todo.isCompleted ? 'checked' : ''} class="form-checkbox h-5 w-5 text-blue-500" />
                    <input
                        type="text"
                        id="todo-title-${todo.id}"
                        value="${todo.title}"
                        class="bg-transparent border-none text-white focus:outline-none"
                        ${todo.isEditing ? '' : 'readonly'}
                    />
                </div>
                <div class="space-x-2">
                    <button
                        id="todo-edit-${todo.id}"
                        class="bg-${todo.isEditing ? 'green' : 'yellow'}-500 hover:bg-${todo.isEditing ? 'green' : 'yellow'}-600 text-white font-bold py-1 px-3 rounded-lg transition">
                        ${todo.isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button
                        id="todo-delete-${todo.id}"
                        class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg transition">
                        Delete
                    </button>
                </div>
            </div>
        `;
    });

    todos.forEach((todo) => {
        document.getElementById(`todo-delete-${todo.id}`).addEventListener('click', () => {
            deleteItem(todo.id);
        });
        document.getElementById(`todo-edit-${todo.id}`).addEventListener('click', () => {
            toggleEditItem(todo.id);
        });
        document.getElementById(`todo-check-${todo.id}`).addEventListener('click', () => {
            checkItem(todo.id);
        });

        if (todo.isCompleted) {
            const inputText = document.getElementById(`todo-title-${todo.id}`);
            inputText.classList.add('line-through', 'text-gray-500');
        }
    });
}

// Handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    checkAuth();
    window.location.href = '../index.html';
});

// Add event listener for adding todos
addBtn.addEventListener("click", () => {
    addItem();
});

checkAuth();

window.addEventListener("load", checkAuth);
