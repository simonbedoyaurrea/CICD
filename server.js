const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const users = [
  { id: 1, name: 'Ana', email: 'ana@mail.com' },
  { id: 2, name: 'Luis', email: 'luis@mail.com' },
  { id: 3, name: 'Maria', email: 'maria@mail.com' }
];

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API' });
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  res.json(user);
});

app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });
  const deleted = users.splice(index, 1);
  res.json({ message: 'Usuario eliminado', user: deleted[0] });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
