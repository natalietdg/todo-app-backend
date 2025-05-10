const app = require('./server-config.js');
const routes = require('./server-routes.js');

const port = process.env.PORT || 5000;

app.get('/health', (req, res) =>{
  res.send({
    up: true
  })
})

app.get('/', routes.getAllTodos);
app.get('/:id', routes.getTodo);

app.post('/', routes.postTodo);
app.patch('/:id', routes.patchTodo);

app.delete('/', routes.deleteAllTodos);
app.delete('/:id', routes.deleteTodo);

app.post('/user', routes.createUser);

app.get('/users', routes.getAllUsers);
app.get('/user/:id', routes.getUser);

app.patch('/user/:id', routes.patchUser);
app.patch('/delete-user/:id', routes.deleteUser);
app.post('/list', routes.createList);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;