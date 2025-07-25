// Helper: Get tasks from localStorage
function getStoredTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Helper: Save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render a single task
function renderTask(task) {
    // General task list
    const taskList = document.getElementById('tasks');
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', task.id);
    listItem.innerHTML = `
        <div class="task">
            <h3>${task.name}</h3>
            <p>${task.description}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Deadline:</strong> ${task.deadline}</p>
            <button class="editTask">Edit</button>
            <button class="completeTask">Complete</button>
            <button class="deleteTask">Delete</button>
        </div>
    `;
    taskList.appendChild(listItem);

    // Kanban
    const kanbanCard = document.createElement('div');
    kanbanCard.className = 'task-card';
    kanbanCard.setAttribute('data-id', task.id);
    kanbanCard.innerHTML = `
        <h4>${task.name}</h4>
        <p>${task.description}</p>
        <p><strong>Deadline:</strong> ${task.deadline}</p>
    `;

    let kanbanColumnId = '';
    switch (task.priority.toLowerCase()) {
        case 'high':
            kanbanColumnId = 'high-tasks';
            break;
        case 'medium':
            kanbanColumnId = 'medium-tasks';
            break;
        case 'low':
            kanbanColumnId = 'low-tasks';
            break;
    }

    document.getElementById(kanbanColumnId).appendChild(kanbanCard);
}

document.addEventListener('DOMContentLoaded', () => {
    // Load and display saved tasks
    const storedTasks = getStoredTasks();
    storedTasks.forEach(renderTask);
});

// Add new task
document.getElementById('addTask').addEventListener('click', function (event) {
    event.preventDefault();

    const taskTitle = document.getElementById('taskTitle').value;
    const taskDescription = document.getElementById('taskDescription').value;
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
        deadline: taskDeadline
    };

    // Save task
    const tasks = getStoredTasks();
    tasks.push(newTask);
    saveTasks(tasks);

    renderTask(newTask);
    alert(`New Task Added to ${newTask.priority} priority column!`);
    document.getElementById('taskForm').reset();
});

document.getElementById('tasks').addEventListener('click', function (event) {
    const taskItem = event.target.closest('li');
    if (!taskItem) return;
    const taskId = taskItem.getAttribute('data-id');

    let tasks = getStoredTasks();

    // Delete tasks
    if (event.target.classList.contains('deleteTask')) {
        taskItem.remove();
        const kanbanTask = document.querySelector(`#kanban-board [data-id="${taskId}"]`);
        if (kanbanTask) kanbanTask.remove();

        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks(tasks);
        alert('Task deleted successfully.');
    }

    // Edittasks
    else if (event.target.classList.contains('editTask')) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('taskTitle').value = task.name;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDeadline').value = task.deadline;

        // Remove from DOM and storage
        taskItem.remove();
        const kanbanTask = document.querySelector(`#kanban-board [data-id="${taskId}"]`);
        if (kanbanTask) kanbanTask.remove();

        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks(tasks);
    }

    // Mark as completed
    else if (event.target.classList.contains('completeTask')) {
        taskItem.classList.add('completed');
        const kanbanTask = document.querySelector(`#kanban-board [data-id="${taskId}"]`);
        if (kanbanTask) kanbanTask.classList.add('completed');
        alert('Task marked as completed.');
    }
});
