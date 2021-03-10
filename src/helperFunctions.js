function isUsernameAlreadyInUse(username, users) {
  return users.some((user) => user.username === username);
}

function getTodoIndex(todos, id) {
  return todos.findIndex((todo) => todo.id === id);
}

function updateTodo(todos, id, updatesObject) {
  const index = getTodoIndex(todos, id);

  if (index === -1) {
    return;
  }

  for (const [key, value] of Object.entries(updatesObject)) {
    todos[index][key] = value;
  }

  return todos[index];
}

function deleteTodo(todos, id) {
  const index = getTodoIndex(todos, id);

  if (index === -1) {
    return;
  }

  const deletedTodo = todos[index];

  todos.splice(index, 1);

  return deletedTodo;
}

module.exports = {
  isUsernameAlreadyInUse,
  updateTodo,
  deleteTodo,
};
