// DOM Elements
const addBtn = document.getElementById("task-btn");
const input = document.getElementById("task-input");
const parent = document.getElementById("todo-parent");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userDate = document.getElementById("date-input")
const userTime = document.getElementById("time-input")

let todos = [];

function getToken() {
    return localStorage.getItem('token');
}

function getHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'token': `${token}`
    };
}

function checkAuth() {
    const token = getToken();
    if (token !== null) {
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

async function addItem() {
    const title = input.value.trim();

    if (title === "") {
        alert("Please enter a task");
        return;
    }
    
    const date = new Date(userDate.value + " " + userTime.value);
    const formattedDate = date.toISOString();  

    try {
        const response = await fetch("https://week6-todo-backend.onrender.com/todos/add", {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ title, completionTime: formattedDate }), 
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

async function checkItem(id) {
    try {
        const response = await fetch(`https://week6-todo-backend.onrender.com/todos/update/${id}`, {
            method: "PATCH",
            headers: getHeaders()
        });

        if (response.ok) {
            await fetchTodos();
        } else {
            alert("Failed to update todo status.");
        }
    } catch (error) {
        console.error("Error updating todo:", error);
    }
}

async function toggleEditItem(id) {
    const todo = todos.find((todo) => todo.id === id);

    if (todo.isEditing) {
        const titleInput = document.getElementById(`todo-title-${id}`);
        const newTitle = titleInput.value.trim();

        if (newTitle === "") {
            alert("Todo item cannot be empty.");
            titleInput.value = todo.title; 
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

function renderTodos(todos) {
    parent.innerHTML = "";
    todos.forEach((todo) => {
        let todoClasses = "bg-transparent border-none text-white focus:outline-none";
    
        if (todo.isCompleteTime && !todo.isCompleted) {
            todoClasses = "bg-transparent border-none text-red-500 focus:outline-none";
        }

        if (todo.isCompleted) {
            todoClasses = "bg-transparent border-none text-gray-500 line-through focus:outline-none";
        }

        parent.innerHTML += `
            <div id="todo-${todo.id}" class="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="todo-check-${todo.id}" ${todo.isCompleted ? 'checked' : ''} class="form-checkbox h-5 w-5 text-blue-500" />
                    <input
                        type="text"
                        id="todo-title-${todo.id}"
                        value="${todo.title}"
                        class="${todoClasses}"
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
    });
}

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    checkAuth();
    window.location.href = '../index.html';
});

addBtn.addEventListener("click", () => {
    addItem();
});

checkAuth();
window.addEventListener("load", checkAuth);
