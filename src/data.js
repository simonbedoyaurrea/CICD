const initialUsers = [
  { id: 1, name: 'Ana', email: 'ana@mail.com' },
  { id: 2, name: 'Luis', email: 'luis@mail.com' },
  { id: 3, name: 'Maria', email: 'maria@mail.com' }
];

let users = [...initialUsers];

const nextId = () => users.reduce((max, u) => Math.max(max, u.id), 0) + 1;

function getUsers() {
  return users;
}

function getUserById(id) {
  return users.find(u => u.id === id);
}

function addUser({ name, email }) {
  const user = { id: nextId(), name, email };
  users.push(user);
  return user;
}

function updateUser(id, { name, email } = {}) {
  const user = getUserById(id);
  if (!user) return null;
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  return user;
}

function deleteUser(id) {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  const [deleted] = users.splice(index, 1);
  return deleted;
}

function reset() {
  users = [...initialUsers];
}

module.exports = { getUsers, getUserById, addUser, updateUser, deleteUser, reset };