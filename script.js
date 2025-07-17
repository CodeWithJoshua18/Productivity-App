// Add task handler
document.getElementById('addBtn').addEventListener('click', function (event) {
    event.preventDefault();

    // Get form input values
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const deadline = document.getElementById('taskDeadline').value;
    const priority = document.getElementById('taskPriority').value;

    if (title === '' || description === '' || deadline === '' || priority === '') {
        alert('Please fill in all fields.');
        return;
    }

    // Create a new <li> element for the task
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.setAttribute('data-priority', priority);

    li.innerHTML = `
        <strong>${title}</strong><br>
        ${description}<br>
        Deadline: ${deadline}<br>
        Priority: ${priority}
        <br>
        <button class="complete-btn">Mark as Completed</button>
    `;

    // Add complete button logic
    li.querySelector('.complete-btn').addEventListener('click', function () {
        li.classList.toggle('completed');
        this.textContent = li.classList.contains('completed') ? 'Completed' : 'Mark as Completed';
    });

    // Add to master list (optional - used for storing all tasks)
    document.getElementById('tasks').appendChild(li);

    // Also add to the correct Kanban column
    addToKanban(li);

    // Reset form
    document.getElementById('taskForm').reset();
});

// Function to add task to the Kanban board based on priority
function addToKanban(taskElement) {
    const priority = taskElement.getAttribute('data-priority');
    let targetColumn;

    if (priority === 'High') {
        targetColumn = document.getElementById('high-tasks');
    } else if (priority === 'Medium') {
        targetColumn = document.getElementById('medium-tasks');
    } else if (priority === 'Low') {
        targetColumn = document.getElementById('low-tasks');
    }

    if (targetColumn) {
        const clone = taskElement.cloneNode(true);

        // Re-attach the completed button event on the cloned node
        clone.querySelector('.complete-btn').addEventListener('click', function () {
            clone.classList.toggle('completed');
            this.textContent = clone.classList.contains('completed') ? 'Completed' : 'Mark as Completed';
        });

        targetColumn.appendChild(clone);
    }
}

// adding local storage functionality
function saveTasks(){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const newTask = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        deadline: document.getElementById('taskDeadline').value,
        priority: document.getElementById('taskPriority').value
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // render tasks immediately
    renderTask(newTask);

    // reset form
    document.getElementById('taskForm').reset();
}

// Function to render a task in the task list
function renderTask(task){
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.setAttribute('data-priority', task.priority);

    li.innerHTML = `
        <strong>${task.title}</strong><br>
        ${task.description}<br>
        Deadline: ${task.deadline}<br>
        Priority: ${task.priority}
        <br>
        <button class="complete-btn">Mark as Completed</button>
    `;

    // Add complete button logic
    li.querySelector('.complete-btn').addEventListener('click', function () {
        li.classList.toggle('completed');
        this.textContent = li.classList.contains('completed') ? 'Completed' : 'Mark as Completed';
    });

    // Append to the master list
    document.getElementById('tasks').appendChild(li);

    addToKanban(li);
}

// Load tasks from local storage on page load
function loadTasks(){
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        renderTask(task);
    });
}