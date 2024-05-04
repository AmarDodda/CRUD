import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', username: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const addUser = () => {
    axios.post('https://jsonplaceholder.typicode.com/users', newUser)
      .then(response => {
        setUsers([...users, response.data]);
        setNewUser({ name: '', email: '', username: '' });
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  };

  const deleteUser = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const editUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      username: user.username
    });
  };

  const updateUser = () => {
    axios.put(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, newUser)
      .then(() => {
        setUsers(users.map(user => (user.id === editingUser.id ? { ...user, ...newUser } : user)));
        setNewUser({ name: '', email: '', username: '' });
        setEditingUser(null);
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">User Management</h1>
      <div className="mb-4">
        <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
        <div className="form-group mb-2">
          <input type="text" className="form-control" name="name" value={newUser.name} onChange={handleChange} placeholder="Name" />
        </div>
        <div className="form-group mb-2">
          <input type="email" className="form-control" name="email" value={newUser.email} onChange={handleChange} placeholder="Email" />
        </div>
        <div className="form-group mb-3">
          <input type="text" className="form-control" name="username" value={newUser.username} onChange={handleChange} placeholder="Username" />
        </div>
        <button className="btn btn-primary mr-2" onClick={editingUser ? updateUser : addUser}>{editingUser ? 'Update User' : 'Add User'}</button>
        {editingUser && <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>}
      </div>
      <div>
        <h2>Users</h2>
        <ul className="list-group">
          {users.map(user => (
            <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div>{user.name}</div>
                <div>{user.email}</div>
                <div>{user.username}</div>
              </div>
              <div className='d-flex'>
                <button className="btn btn-info mr-2" onClick={() => editUser(user)}>Edit</button>
                <button className="btn btn-danger" style={{ marginLeft: '8px' }} onClick={() => deleteUser(user.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
