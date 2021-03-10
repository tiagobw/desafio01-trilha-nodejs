const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const {
  isUsernameAlreadyInUse,
  updateTodo,
  deleteTodo,
} = require("./helperFunctions");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  if (isUsernameAlreadyInUse(username, users)) {
    [request.user] = users.filter((user) => user.username === username);
    return next();
  }

  return response.status(404).json({
    error: "User does not exist.",
  });
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  if (isUsernameAlreadyInUse(username, users)) {
    return response.status(400).json({
      error: "The username is already in use.",
    });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  return response.json(request.user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  request.user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const todos = request.user.todos;

  const updatedTodo = updateTodo(todos, id, request.body);

  if (!updatedTodo) {
    return response.status(404).json({ error: "Todo does not exist." });
  }

  return response.json(updatedTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const todos = request.user.todos;

  const updatedTodo = updateTodo(todos, id, { done: true });

  if (!updatedTodo) {
    return response.status(404).json({ error: "Todo does not exist." });
  }

  return response.json(updatedTodo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const todos = request.user.todos;

  const deletedTodo = deleteTodo(todos, id);

  if (!deletedTodo) {
    return response.status(404).json({ error: "Todo does not exist." });
  }

  return response.status(204).json(deletedTodo);
});

module.exports = app;
