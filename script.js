
const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");

const themeBtn = document.getElementById("themeBtn");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all";

// SAVE TASKS

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// LOAD TASKS

function loadTasks() {

    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }

    displayTasks();
    updateStats();
}

// UPDATE DASHBOARD

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").innerText = total;

    document.getElementById("completedTasks").innerText = completed;

    document.getElementById("pendingTasks").innerText = pending;

    document.getElementById("progressText").innerText =
        percentage + "%";

    document.getElementById("progressFill").style.width =
        percentage + "%";
}

// DISPLAY TASKS

function displayTasks() {

    taskList.innerHTML = "";

    let visibleTasks = 0;

    tasks.forEach((task, index) => {

        if (currentFilter === "completed" && !task.completed) {
            return;
        }

        if (currentFilter === "pending" && task.completed) {
            return;
        }

        visibleTasks++;

        const li = document.createElement("li");

        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");

        if (task.completed) {
            taskInfo.classList.add("completed");
        }

        let priorityClass = task.priority.toLowerCase();

        const taskName = document.createElement("strong");
        taskName.textContent = task.text;

        const date = document.createElement("div");
        date.classList.add("task-date");
        date.textContent = "Due: " + (task.date || "No Date");

        const priorityText = document.createElement("div");
        priorityText.classList.add("priority", priorityClass);
        priorityText.textContent = "Priority: " + task.priority;

        taskInfo.appendChild(taskName);
        taskInfo.appendChild(date);
        taskInfo.appendChild(priorityText);

        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("task-buttons");

        // COMPLETE BUTTON

        const doneBtn = document.createElement("button");
        doneBtn.innerText = task.completed ? "Undo" : "Done";
        doneBtn.classList.add("complete-btn");

        doneBtn.addEventListener("click", function() {

            tasks[index].completed = !tasks[index].completed;

            saveTasks();
            displayTasks();
            updateStats();
        });

        // EDIT BUTTON

        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("edit-btn");

        editBtn.addEventListener("click", function() {

            const updatedTask = prompt("Edit Task", task.text);

            if (updatedTask !== null && updatedTask.trim() !== "") {

                tasks[index].text = updatedTask.trim();

                saveTasks();
                displayTasks();
            }
        });

        // DELETE BUTTON

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", function() {

            if (confirm("Are you sure you want to delete this task?")) {

                tasks.splice(index, 1);

                saveTasks();
                displayTasks();
                updateStats();
            }
        });

        buttonDiv.appendChild(doneBtn);
        buttonDiv.appendChild(editBtn);
        buttonDiv.appendChild(deleteBtn);

        li.appendChild(taskInfo);
        li.appendChild(buttonDiv);

        taskList.appendChild(li);

    });

    document.getElementById("emptyMessage").style.display =
        visibleTasks === 0 ? "block" : "none";
}

// ADD TASK

addBtn.addEventListener("click", function() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    const task = {

        text: text,
        date: dueDate.value,
        priority: priority.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";
    dueDate.value = "";

    displayTasks();
    updateStats();
});

// FILTER TASKS

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        displayTasks();
    });
});

// DARK / LIGHT MODE

themeBtn.addEventListener("click", function() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.innerText = "☀️";
    } else {
        themeBtn.innerText = "🌙";
    }

});

// LOAD TASKS

loadTasks();
