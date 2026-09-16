const { Router } = require('express');
const store = require('../data');

const router = Router();

function parseId(id) {
  const value = Number.parseInt(id, 10);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.get('/stats', (req, res) => {
  const users = store.getUsers();
  res.json({
    total: users.length,
    emailDomains: [...new Set(users.map(u => u.email.split('@')[1]))]
  });
});

router.get('/', (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const q = (req.query.q || '').toString().toLowerCase();

  let result = store.getUsers();
  if (q) {
    result = result.filter(u =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const data = result.slice((page - 1) * limit, page * limit);

  res.json({ data, pagination: { page, limit, total, totalPages } });
});

router.get('/:id(\\d+)', (req, res) => {
  const user = store.getUserById(parseId(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
});

router.post('/', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'El nombre es requerido y debe ser texto' });
  }
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ error: 'El email es requerido y debe ser válido' });
  }
  const user = store.addUser({ name: name.trim(), email: email.trim() });
  res.status(201).json(user);
});

router.put('/:id(\\d+)', (req, res) => {
  const user = store.updateUser(parseId(req.params.id), req.body || {});
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
});

router.delete('/:id(\\d+)', (req, res) => {
  const deleted = store.deleteUser(parseId(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ message: 'Usuario eliminado', user: deleted });
});

module.exports = router;