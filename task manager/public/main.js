let token = "";
let editingTaskId = null;

// Toggle Signup/Login
function toggleForms(formToShow) {
  document.getElementById("signupForm").classList.toggle("hidden", formToShow !== "signup");
  document.getElementById("loginForm").classList.toggle("hidden", formToShow !== "login");
}

// Logout
function logout() {
  token = "";
  document.getElementById("taskForm").classList.add("hidden");
  document.getElementById("taskList").classList.add("hidden");
  document.getElementById("logoutContainer").classList.add("hidden");
  toggleForms("login");
  alert("Logged out successfully");
}

// Signup
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  const res = await fetch("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Signup successful! Please log in.");
    toggleForms("login");
  } else {
    alert(data.message || "Signup failed");
  }
});

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok && data.token) {
    token = data.token;
    alert("Login successful");

    document.getElementById("signupForm").classList.add("hidden");
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("taskForm").classList.remove("hidden");
    document.getElementById("taskList").classList.remove("hidden");
    document.getElementById("logoutContainer").classList.remove("hidden");

    fetchTasks();
  } else {
    alert(data.message || "Login failed");
  }
});

// Create Task
document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDesc").value;

  const res = await fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Task created successfully");
    document.getElementById("taskForm").reset();
    fetchTasks();
  } else {
    alert(data.message || "Failed to create task");
  }
});

// Fetch Tasks
async function fetchTasks() {
  const res = await fetch("/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const tasks = await res.json();
  const container = document.getElementById("tasksContainer");
  container.innerHTML = "";

  if (res.ok && tasks.length > 0) {
    tasks.forEach((task) => {
      const div = document.createElement("div");
      div.className = "p-3 border border-gray-300 rounded bg-gray-50 shadow-sm";
      div.innerHTML = `
        <h3 class="text-lg font-medium">${task.title}</h3>
        <p class="text-gray-600">${task.description}</p>
        <p class="text-sm text-gray-500">Completed: ${task.completed}</p>
        <p class="text-xs text-gray-400">Created: ${new Date(task.createdAt).toLocaleString()}</p>
        <div class="flex gap-2 mt-2">
          <button onclick="openEditModal('${task._id}', '${task.title}', '${task.description}')" class="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
          <button onclick="deleteTask('${task._id}')" class="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
        </div>
      `;
      container.appendChild(div);
    });
  } else {
    container.innerHTML = "<p class='text-sm text-gray-400'>No tasks found.</p>";
  }
}

// Delete Task
async function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  const res = await fetch(`/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204) {
    alert("Task deleted");
    fetchTasks();
  } else {
    const data = await res.json();
    alert(data.message || "Failed to delete task");
  }
}

// Open Edit Modal
function openEditModal(id, title, desc) {
  editingTaskId = id;
  document.getElementById("editTitle").value = title;
  document.getElementById("editDesc").value = desc;
  document.getElementById("editModal").classList.remove("hidden");
}

// Close Edit Modal
function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}

// Save Updated Task
document.getElementById("saveEditBtn").addEventListener("click", async () => {
  const title = document.getElementById("editTitle").value;
  const description = document.getElementById("editDesc").value;

  const res = await fetch(`/tasks/${editingTaskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Task updated successfully");
    closeEditModal();
    fetchTasks();
  } else {
    alert(data.message || "Failed to update task");
  }
});
