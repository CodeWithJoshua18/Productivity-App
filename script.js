// Add tasks functionality
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

    // get the <ul> where tasks will be displayed
    const taskList = document.getElementById('tasks');

    // Create a new list item for the task
    const listItem = document.createElement('li');

    // Set the content of the list item
    listItem.innerHTML = `
        <div class = "task">
        <h3>${newTask.name}</h3>
        <p>${newTask.description}</p>
        <p><strong>Priority:</strong> ${newTask.priority}</p>
        <p><strong>Deadline:</strong> ${newTask.deadline}</p>
        <button class="editTask">Edit</button>
        <button class="completeTask">Complete</button>
        <button class="deleteTask">Delete</button>
        </div>
    `;

    // Append the new list item to the task list
    taskList.appendChild(listItem);
    


    // Here you would typically send the newTask to your server or add it to a list
    alert('New Task Added:', newTask);

    // Clear the form fields after adding the task
    document.getElementById('taskForm').reset();
});
