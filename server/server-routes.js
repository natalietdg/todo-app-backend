const _ = require('lodash');
const todos = require('./database/todo-queries.js');
const users = require('./database/user-queries.js');
const { nanoid } = require('nanoid');

const Status = {
  ACTIVE: 'active',
  IN_PROGRESS: 'in progress'
}

function createToDo(req, data) {
  const protocol = req.protocol, 
    host = req.get('host'), 
    id = data.id;
    // status, listid, assignedto
    // createList First
    // if user exists

  return {
    title: data.title,
    order: data.order,
    status: data.status ?? Status.ACTIVE,
    completed: data.completed || false,
    url: `${protocol}://${host}/${id}`
  };
}

async function getAllTodos(req, res) {
  const { query } = req;
  
  const allEntries = await todos.all(query);
  return res.send(allEntries.map( _.curry(createToDo)(req) ));
}

async function getTodo(req, res) {
  const todo = await todos.get(req.params.id);
  return res.send(todo);
}

async function postTodo(req, res) {
  const { body } = req;
  const created = await todos.create(body);
  return res.send(createToDo(req, created));
}

async function patchTodo(req, res) {
  const patched = await todos.update(req.params.id, req.body);
  return res.send(createToDo(req, patched));
}

async function deleteAllTodos(req, res) {
  const deletedEntries = await todos.clear();
  return res.send(deletedEntries.map( _.curry(createToDo)(req) ));
}

async function deleteTodo(req, res) {
  const deleted = await todos.delete(req.params.id);
  return res.send(createToDo(req, deleted));
}

function addErrorReporting(func, message) {
    return async function(req, res) {
        try {
            return await func(req, res);
        } catch(err) {
            console.log(`${message} caused by: ${err}`);

            // Not always 500, but for simplicity's sake.
            res.status(500).send(`Opps! ${message}.`);
        } 
    }
}

async function createUser(req, res) {
  const { body } = req;
  const created = await users.create({
    ...body,
    id: nanoid()
  });
  res.send(created);
}

async function getAllUsers(req, res) {
  try {
    const { query } = req;
    const userResults = await users.all(query);
  
    res.send(userResults);
  }
  catch(error) {
    console.log(error);

    res.send({
      ...error
    })
  }
}

async function getUser(req, res) {
  try {
    const { params } = req;
    const user = await users.get(params.id)

    res.send(user)
  }
  catch(error) {
    console.log(error);
    res.send({
      ...error
    })
  }
}

async function patchUser(req, res) {
  try {
    const { body, params } = req;

    const patchedUser = await users.patch(params.id, body);

    res.send(patchedUser);
  }
  catch(error) {
    console.log(error);
    res.send(error);
  }
}

async function deleteUser(req, res) {
  try {
    const { params } = req;
    const deletedUser = await users.patch(params.id, { deleted: true });

    res.send(deletedUser);
  }
  catch(error) { 
    console.log(error);
    res.send(error);
  }
}

const toExport = {
    getAllTodos: { method: getAllTodos, errorMessage: "Could not fetch all todos" },
    getTodo: { method: getTodo, errorMessage: "Could not fetch todo" },
    postTodo: { method: postTodo, errorMessage: "Could not post todo" },
    patchTodo: { method: patchTodo, errorMessage: "Could not patch todo" },
    deleteAllTodos: { method: deleteAllTodos, errorMessage: "Could not delete all todos" },
    deleteTodo: { method: deleteTodo, errorMessage: "Could not delete todo" },
    createUser: { method: createUser, errorMessage: "Could not create user"},
    getAllUsers: { method: getAllUsers, errorMessage: "Could not fetch all users"},
    getUser: { method: getUser, errorMessage: "Could not get user"},
    patchUser: { method: patchUser, errorMessage: "Could not patch user"},
    deleteUser: { method: deleteUser, errorMessage: "Could not delete user"}
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;
