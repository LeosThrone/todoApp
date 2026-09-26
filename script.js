// list of tasks, each one is {text: "...", done: true/false}
var tasks = [];
var filter = "all";

// load saved tasks when the page opens
var saved = localStorage.getItem("tasks");
if (saved) {
  tasks = JSON.parse(saved);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  var input = document.getElementById("taskInput");
  var text = input.value;

  if (text == "") {
    return;
  }

  tasks.push({ text: text, done: false });
  input.value = "";
  saveTasks();
  showTasks();
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  saveTasks();
  showTasks();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  saveTasks();
  showTasks();
}

function setFilter(f) {
  filter = f;
  showTasks();
}

function clearDone() {
  var newTasks = [];
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].done == false) {
      newTasks.push(tasks[i]);
    }
  }
  tasks = newTasks;
  saveTasks();
  showTasks();
}

function showTasks() {
  var list = document.getElementById("list");
  list.innerHTML = "";

  // count how many are left
  var left = 0;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].done == false) {
      left = left + 1;
    }
  }
  document.getElementById("subline").innerHTML = left + " tasks left";
  document.getElementById("countLine").innerHTML = tasks.length + " total";

  var shown = 0;

  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];

    if (filter == "active" && t.done == true) {
      continue;
    }
    if (filter == "done" && t.done == false) {
      continue;
    }

    shown = shown + 1;

    var li = document.createElement("li");
    li.className = "task";
    if (t.done == true) {
      li.className = "task done";
    }

    var check = document.createElement("div");
    check.className = "check";
    check.setAttribute("data-index", i);
    check.onclick = function () {
      var index = this.getAttribute("data-index");
      toggleTask(index);
    };

    var text = document.createElement("div");
    text.className = "text";
    text.innerHTML = t.text;

    var del = document.createElement("button");
    del.className = "del";
    del.innerHTML = "x";
    del.setAttribute("data-index", i);
    del.onclick = function () {
      var index = this.getAttribute("data-index");
      deleteTask(index);
    };

    li.appendChild(check);
    li.appendChild(text);
    li.appendChild(del);
    list.appendChild(li);
  }

  var emptyMsg = document.getElementById("emptyMsg");
  if (shown == 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
  }
}

// set up the tab buttons (All / Active / Done)
var tabs = document.querySelectorAll(".tab");
for (var i = 0; i < tabs.length; i++) {
  tabs[i].onclick = function () {
    for (var j = 0; j < tabs.length; j++) {
      tabs[j].className = "tab";
    }
    this.className = "tab active";
    setFilter(this.getAttribute("data-filter"));
  };
}

document.getElementById("addForm").onsubmit = function (e) {
  e.preventDefault();
  addTask();
};

document.getElementById("clearBtn").onclick = function () {
  clearDone();
};

showTasks();
