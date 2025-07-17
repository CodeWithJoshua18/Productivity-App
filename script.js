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

     // create a new li element to display the task
   


    // Here you would typically send the newTask to your server or add it to a list
    alert('New Task Added:', newTask);

    // Clear the form fields after adding the task
    document.getElementById('taskForm').reset();
});