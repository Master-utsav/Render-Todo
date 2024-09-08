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

const token = getToken();
const headers = {
    'Content-Type': 'application/json',
    'token': token
};
// Check if user is logged in
function checkAuth() {
    if (token) {
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
    const response = await fetch("https://week6-todo-backend.onrender.com/todos/", {
        headers: headers.token
    })

    if (response.ok) {
        todos = await response.json();
        renderTodos(todos);
    } else {
        alert("Failed to fetch todos. Please log in.");
    }
}

// Handle adding a todo item
async function addItem() {
    const title = input.value.trim();

    if (title === "") {
        alert("Please enter a task");
        return;
    }

    const response = await fetch("https://week6-todo-backend.onrender.com/todos/add", {
        method: "POST",
        headers: headers,
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
}

// Handle deleting a todo item
async function deleteItem(id) {
    const response = await fetch(`https://week6-todo-backend.onrender.com/todos/delete/${id}`, {
        method: "DELETE",
        headers:  headers.token
    });

    if (response.ok) {
        todos = todos.filter((todo) => todo.id !== id);
        renderTodos(todos);
    } else {
        alert("Failed to delete todo.");
    }
}

// Handle toggling the completion status of a todo
async function checkItem(id) {

    const response = await fetch(`https://week6-todo-backend.onrender.com/todos/update/${id}`, {
        method: "PATCH",
        headers:  headers.token
    });

    if (response.ok) {
        todos = todos.map((todo) => todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo);
        renderTodos(todos);
    } else {
        alert("Failed to update todo status.");
    }
}

// Handle updating the text of a todo item
async function toggleEditItem(id) {
    const todo = todos.find((todo) => todo.id === id);

    if (todo.isEditing) {
        const titleInput = document.getElementById(todo.TodoTextId);
        const newTitle = titleInput.value.trim();

        if (newTitle === "") {
            alert("Todo item cannot be empty.");
            titleInput.value = todo.title;
            return;
        }

        const response = await fetch(`https://week6-todo-backend.onrender.com/todos/updateText/${id}`, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify({ title: newTitle }),
        });

        if (response.ok) {
            todo.title = newTitle;
        } else {
            alert("Failed to update todo.");
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
            <div id="${todo.todoId}" class="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="${todo.checkId}" ${todo.isCompleted ? 'checked' : ''} class="form-checkbox h-5 w-5 text-blue-500" />
                    <input
                        type="text"
                        id="${todo.TodoTextId}"
                        value="${todo.title}"
                        ${todo.isEditing ? 'class="bg-transparent border-none text-white focus:outline-none focus:ring focus:ring-blue-500"' : 'class="bg-transparent border-none text-white focus:outline-none" readonly'}
                    />
                </div>
                <div class="space-x-2">
                    <button
                        id="${todo.editId}"
                        class="bg-${todo.isEditing ? 'green' : 'yellow'}-500 hover:bg-${todo.isEditing ? 'green' : 'yellow'}-600 text-white font-bold py-1 px-3 rounded-lg transition">
                        ${todo.isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button
                        id="${todo.deleteId}"
                        class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg transition">
                        Delete
                    </button>
                </div>
            </div>
        `;
    });

    todos.forEach((todo) => {
        document.getElementById(todo.deleteId).addEventListener('click', () => {
            deleteItem(todo.id);
        });
        document.getElementById(todo.editId).addEventListener('click', () => {
            toggleEditItem(todo.id);
        });

        if (todo.isEditing) {
            const inputField = document.getElementById(todo.TodoTextId);
            inputField.focus();
            inputField.classList.add('outline-none', 'ring', 'ring-blue-500', 'rounded-md', 'p-1');
        }

        document.getElementById(todo.checkId).addEventListener('click', () => {
            checkItem(todo.id);
        });

        if (todo.isCompleted) {
            const inputText = document.getElementById(todo.TodoTextId);
            inputText.classList.add('line-through', 'text-gray-500');
        }
    });
}

// Handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    checkAuth();
});

// Add event listener for adding todos
addBtn.addEventListener("click", () => {
    addItem();
});

checkAuth();
