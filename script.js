// adding functionality to handle task addition
document.getElementById('addBtn').addEventListener('click', function(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get the values from the form inputs
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const deadline = document.getElementById('taskDeadline').value;
    const priority = document.getElementById('taskPriority').value;

    // Validate the inputs
    if (title !== '') {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${title}</strong><br>${description}<br>Deadline: ${deadline}<br>Priority: ${priority}`;
        document.getElementById('tasks').appendChild(li);

        // Optionally clear the form
        document.getElementById('taskForm').reset();
    } else {
        alert('Please enter a task title');
    }

    // Create a new task object
    const newTask = {
        title: title,
        description: description,
        deadline: new Date(deadline),
        priority: priority,
        completed: false
    };

    // You can log or store newTask as needed
    alert('Task Added:', newTask);
});


