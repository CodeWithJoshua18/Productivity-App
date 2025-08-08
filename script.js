// TASK STORAGE 
function getStoredTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// NOTIFICATION SETUP
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function sendNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
}

// RENDER TASK 
function renderTask(task) {
    // General list
    const taskList = document.getElementById('tasks');
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', task.id);
    listItem.innerHTML = `
        <div class="task">
            <h3>${task.name}</h3>
            <p>${task.description}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Deadline:</strong> ${new Date(task.deadline).toLocaleString()}</p>
            <button class="editTask">Edit</button>
            <button class="completeTask">Complete</button>
            <button class="deleteTask">Delete</button>
        </div>
    `;
    taskList.appendChild(listItem);

    // Kanban card
    const kanbanCard = document.createElement('div');
    kanbanCard.className = 'task-card';
    kanbanCard.setAttribute('data-id', task.id);
    kanbanCard.innerHTML = `
        <h4>${task.name}</h4>
        <p>${task.description}</p>
        <p><strong>Deadline:</strong> ${new Date(task.deadline).toLocaleString()}</p>
    `;

    let kanbanColumnId = '';
    switch (task.priority.toLowerCase()) {
        case 'high': kanbanColumnId = 'high-tasks'; break;
        case 'medium': kanbanColumnId = 'medium-tasks'; break;
        case 'low': kanbanColumnId = 'low-tasks'; break;
    }

    document.getElementById(kanbanColumnId).appendChild(kanbanCard);

    // Apply initial color coding
    updateTaskColor(task);
}

// COLOR CODING 
function updateTaskColor(task) {
    const now = new Date();
    const deadlineDate = new Date(task.deadline);
    const timeDiff = deadlineDate - now;
    const oneDayMs = 24 * 60 * 60 * 1000;

    const listItem = document.querySelector(`#tasks [data-id="${task.id}"] .task`);
    const kanbanCard = document.querySelector(`#kanban-board [data-id="${task.id}"]`);

    let color = '';
    if (task.completed) {
        color = 'lightgreen';
    } else if (timeDiff <= 0) {
        color = '#ff6961'; // red
    } else if (timeDiff <= oneDayMs) {
        color = '#fdfd96'; // yellow
    } else {
        color = ''; // default
    }

    if (listItem) listItem.style.backgroundColor = color;
    if (kanbanCard) kanbanCard.style.backgroundColor = color;
}

// LOAD EXISTING TASKS 
document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = getStoredTasks();
    storedTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    storedTasks.forEach(renderTask);

    setInterval(checkDeadlines, 60000); // every 1 min
    checkDeadlines();
});

// ====== ADD NEW TASK ======
document.getElementById('addTask').addEventListener('click', function (event) {
    event.preventDefault();

    const taskTitle = document.getElementById('taskTitle').value.trim();
    const taskDescription = document.getElementById('taskDescription').value.trim();
    const taskPriority = document.getElementById('taskPriority').value;
    const taskDeadline = document.getElementById('taskDeadline').value;

    if (!taskTitle || !taskPriority || !taskDescription || !taskDeadline) {
        alert('Please fill in all fields.');
        return;
    }

    const taskId = 'task-' + Date.now();
    const newTask = {
        id: taskId,
        name: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        deadline: new Date(taskDeadline).toISOString(),
        notifiedDueSoon: false,
        notifiedDeadlineReached: false,
        completed: false
    };

    const tasks = getStoredTasks();
    tasks.push(newTask);
    saveTasks(tasks);

    renderTask(newTask);
    alert(`New Task Added to ${newTask.priority} priority column!`);
    document.getElementById('taskForm').reset();
});

// ====== DELETE / EDIT / COMPLETE ======
document.getElementById('tasks').addEventListener('click', function (event) {
    const taskItem = event.target.closest('li');
    if (!taskItem) return;

    const taskId = taskItem.getAttribute('data-id');
    let tasks = getStoredTasks();

    // DELETE
    if (event.target.classList.contains('deleteTask')) {
        taskItem.remove();
        const kanbanTask = document.querySelector(`#kanban-board [data-id="${taskId}"]`);
        if (kanbanTask) kanbanTask.remove();

        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks(tasks);
        alert('Task deleted successfully.');
    }

    // EDIT
    else if (event.target.classList.contains('editTask')) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('taskTitle').value = task.name;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDeadline').value = new Date(task.deadline).toISOString().slice(0, 16);

        taskItem.remove();
        const kanbanTask = document.querySelector(`#kanban-board [data-id="${taskId}"]`);
        if (kanbanTask) kanbanTask.remove();

        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks(tasks);
    }

    // COMPLETE
    else if (event.target.classList.contains('completeTask')) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = true;
        saveTasks(tasks);

        taskItem.classList.add('completed');
        const kanbanTask = document.querySelector(`#kanban-board [data-id="${taskId}"]`);
        if (kanbanTask) kanbanTask.classList.add('completed');

        updateTaskColor(task);
        alert('Task marked as completed.');
    }
});

// ====== DEADLINE CHECKER ======
function checkDeadlines() {
    const tasks = getStoredTasks();
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    let updated = false;

    tasks.forEach(task => {
        const deadlineDate = new Date(task.deadline);
        const timeDiff = deadlineDate - now;

        // Due soon
        if (timeDiff <= oneDayMs && timeDiff > 0 && !task.notifiedDueSoon && !task.completed) {
            sendNotification("Task Due Soon", `The task "${task.name}" is due in less than 24 hours!`);
            task.notifiedDueSoon = true;
            updated = true;
        }

        // Deadline reached
        if (timeDiff <= 0 && !task.notifiedDeadlineReached && !task.completed) {
            sendNotification("Deadline Reached", `⚠️ The task "${task.name}" has reached its deadline!`);
            task.notifiedDeadlineReached = true;
            updated = true;
        }

        updateTaskColor(task);
    });

    if (updated) {
        saveTasks(tasks);
    }
}
