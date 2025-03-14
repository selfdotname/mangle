$(window).on("load", function () {
  const labelEventFunction = function () {
    const isChecked = $(this).find("input[type=checkbox]").is(":checked")
    const taskId = $(this).parent().data("id")
    let tasks = JSON.parse(localStorage.getItem("tasks")) || []
    tasks = tasks.map(task => task.id === taskId ? { ...task, completed: isChecked } : task)
    localStorage.setItem("tasks", JSON.stringify(tasks))

    if (isChecked) {
      $(this).find("span").css({ "text-decoration": "line-through" })
    } else {
      $(this).find("span").css({ "text-decoration": "none" })
    }
  }

  const deleteEventFunction = function () {
    const taskId = $(this).parent().data("id")
    let tasks = JSON.parse(localStorage.getItem("tasks")) || []
    tasks = tasks.filter(task => task.id !== taskId)
    localStorage.setItem("tasks", JSON.stringify(tasks))
    $(this).parent().remove()
  }

  const editEventFunction = function () {
    if (!$(this).parent().find("label input[type=checkbox]").is(":checked")) {
      $(this).parent().find("label input[type=checkbox]").attr({ "disabled": "true" })
      const taskText = $(this).parent().find("label span").text()
      $(this).parent().find("label span").remove()
      $(this).parent().find("label").append(`<input type="text"/>`)
      $(this).parent().find("label input[type=text]").focus().val(taskText)
      $(this).parent().find("button.edit").text("Update").removeClass("edit").addClass("update")
      $(this).parent().find("button.update").off("click").on("click", function () {
        if ($(this).parent().find("label input[type=text]").val()) {
          const updatedTaskText = $(this).parent().find("label input[type=text]").val()
          const taskId = $(this).parent().data("id")
          let tasks = JSON.parse(localStorage.getItem("tasks")) || []
          tasks = tasks.map(task => task.id === taskId ? { ...task, task: updatedTaskText } : task)
          localStorage.setItem("tasks", JSON.stringify(tasks))
          $(this).parent().find("label input[type=text]").remove()
          $(this).parent().find("label").append(`<span>${updatedTaskText}</span>`)
          $(this).text("Edit").removeClass("update").addClass("edit").off("click").on("click", editEventFunction)
          $(this).parent().find("label input[type=checkbox]").removeAttr("disabled")
        } else {
          showError("Update cannot be empty")
        }
      })
    } else {
      showError("Cannot update a completed task")
    }
  }

  function showError(message) {
    var error = $("p.error")
    error.show().text(message)
    setTimeout(() => error.hide(), 3000)
  }

  function renderTasks() {
    $(".tasks").empty()
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []
    tasks.forEach(task => {
      $(".tasks").prepend(`
        <div class="task" data-id="${task.id}">
          <label>
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.task}</span>
          </label>
          <button class="delete">Delete</button>
          <button class="edit">Edit</button>
        </div>
      `)
    })
    $("label").on("click", labelEventFunction)
    $("button.delete").on("click", deleteEventFunction)
    $("button.edit").on("click", editEventFunction)
  }

  console.log("jQuery active!!!")
  renderTasks()

  $("button.add-task-btn").on("click", function () {
    const input = $("input[type=text]")
    if (input.val()) {
      const newTask = { id: Date.now(), task: input.val(), completed: false }
      let tasks = JSON.parse(localStorage.getItem("tasks")) || []
      tasks.push(newTask)
      localStorage.setItem("tasks", JSON.stringify(tasks))
      input.val("")
      renderTasks()
    } else {
      showError("Task cannot be empty")
    }
  })
})
