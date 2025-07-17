document.getElementById('addTask').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get task details
    const taskTitle = document.getElementById('taskTitle').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskPriority = document.getElementById('taskPriority').value;
    const taskDeadline = document.getElementById('taskDeadline').value;

    // Validate inputs
    if (!taskTitle || !taskPriority || !taskDescription || !taskDeadline) {
        alert('Please fill in all fields.');
        return;
    }

    // Create a new task object
    const newTask = {
        name: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        deadline: taskDeadline
    };

    // Optional: Add to the general <ul id="tasks"> list
    const taskList = document.getElementById('tasks');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div class="task">
            <h3>${newTask.name}</h3>
            <p>${newTask.description}</p>
            <p><strong>Priority:</strong> ${newTask.priority}</p>
            <p><strong>Deadline:</strong> ${newTask.deadline}</p>
            <button class="editTask">Edit</button>
            <button class="completeTask">Complete</button>
            <button class="deleteTask">Delete</button>
        </div>
    `;
    taskList.appendChild(listItem);

    // 🔥 Append to the correct Kanban column based on priority
    const kanbanCard = document.createElement('div');
    kanbanCard.className = 'task-card'; // You can style this in your CSS
    kanbanCard.innerHTML = `
        <h4>${newTask.name}</h4>
        <p>${newTask.description}</p>
        <p><strong>Deadline:</strong> ${newTask.deadline}</p>
    `;

    let kanbanColumnId = '';
    switch (newTask.priority.toLowerCase()) {
        case 'high':
            kanbanColumnId = 'high-tasks';
            break;
        case 'medium':
            kanbanColumnId = 'medium-tasks';
            break;
        case 'low':
            kanbanColumnId = 'low-tasks';
            break;
        default:
            alert('Unknown priority level.');
            return;
    }

    document.getElementById(kanbanColumnId).appendChild(kanbanCard);

    // Notify user
    alert(`New Task Added to ${newTask.priority} priority column!`);

    // Clear the form
    document.getElementById('taskForm').reset();
});
