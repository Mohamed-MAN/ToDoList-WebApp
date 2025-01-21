// Select the "Add Task" button and add a click event listener to it
let newTask = document.querySelector(".addTask");
newTask.addEventListener("click", addTask);

// Select the input field and add a keydown event listener to add task on pressing "Enter"
let taskInput = document.getElementById("taskInput");
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

// Function to add a new task to the task list
function addTask(e) {
    let input = document.getElementById("taskInput");
    let taskItem = document.createElement("input");
    taskItem.type = "text";
    taskItem.classList.add("taskItem");
    taskItem.value = input.value;

    if (input.value) {
        let task = document.createElement("li");
        task.appendChild(taskItem);

        // Create and add delete button to the task
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="far fa-trash-alt"></i>';
        deleteButton.classList.add("delete");
        deleteButton.addEventListener("click", function () {
            task.remove();
            localStorage.removeItem(key);
        });

        // Create and add edit button to the task
        let editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fas fa-pen"></i>';
        editButton.classList.add("edit");
        editButton.addEventListener("click", function () {
            taskItem.focus();
        });

        // Create and add done button to the task
        let doneButton = document.createElement("button");
        doneButton.innerHTML = '<i class="fas fa-check-square"></i>';
        doneButton.classList.add("done");
        doneButton.addEventListener("click", function () {
            taskItem.classList.toggle("isDone");
            let value = taskItem.value;
            let isDone = taskItem.classList.contains("isDone");
            localStorage.setItem(key, JSON.stringify({ value, isDone }));
        });

        // Append all buttons to the task
        task.appendChild(deleteButton);
        task.appendChild(editButton);
        task.appendChild(doneButton);

        // Append the task to the task list and save it to local storage
        let list = document.querySelector("ul");
        list.appendChild(task);
        let x = list.children.length;
        x += 1;
        localStorage.setItem(`task ${x}`, input.value);
    }
}

// Function to get all tasks from local storage
function getAllLocalStorage() {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        all[key] = value;
    }
    return all;
}

// Function to map tasks from local storage to the task list
function mapTasks() {
    const allTasks = getAllLocalStorage();
    let list = document.querySelector("ul");
    list.innerHTML = "";

    // Iterate through all tasks and create task elements
    for (const key in allTasks) {
        if (allTasks.hasOwnProperty(key)) {
            let value = allTasks[key];
            let task = document.createElement("li");
            let taskItem = document.createElement("input");
            taskItem.type = "text";
            taskItem.classList.add("taskItem");
            taskItem.value = value;

            // Check if task data includes "isDone" status
            let isDone = false;
            if (typeof value === 'string' && value.startsWith('{')) {
                let taskData = JSON.parse(value);
                isDone = taskData.isDone;
                taskItem.value = taskData.value;
            }

            // Toggle "isDone" class based on task status
            if (isDone) {
                taskItem.classList.add("isDone");
            }

            task.appendChild(taskItem);

            // Create and add delete button to the task
            let deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="far fa-trash-alt"></i>';
            deleteButton.classList.add("delete");
            deleteButton.addEventListener("click", (function (key) {
                return function () {
                    task.remove();
                    localStorage.removeItem(key);
                };
            })(key));

            // Create and add edit button to the task
            let editButton = document.createElement("button");
            editButton.innerHTML = '<i class="fas fa-pen"></i>';
            editButton.classList.add("edit");
            editButton.addEventListener("click", function () {
                taskItem.focus();
                taskItem.addEventListener("change", function () {
                    value = taskItem.value;
                    localStorage.setItem(key, value);
                    if (taskItem.classList.toggle("isDone")) {
                        taskItem.classList.toggle("isDone");
                    }
                });
            });

            // Create and add done button to the task
            let doneButton = document.createElement("button");
            doneButton.innerHTML = '<i class="fas fa-check-square"></i>';
            doneButton.classList.add("done");
            doneButton.addEventListener("click", function () {
                taskItem.classList.toggle("isDone");
                let value = taskItem.value;
                let isDone = taskItem.classList.contains("isDone");
                localStorage.setItem(key, JSON.stringify({ value, isDone }));
            });

            // Append all buttons to the task
            task.appendChild(deleteButton);
            task.appendChild(editButton);
            task.appendChild(doneButton);
            list.appendChild(task);
        }
    }
}

// Initialize task list from local storage on page load
mapTasks();