import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiSearch, FiHome, FiLogOut } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const {id, obj} = useSelector((state)=>state.getUser);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
 

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/users`);
        const data =  response.data;
        let students = data.filter(user => user.role === "STUDENT");
        setUsers(students);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    if(localStorage.getItem("adminlogin")){
      localStorage.removeItem("adminlogin")
      location.reload()
    }


    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form (create or update user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        const api = await axios.get(`${import.meta.env.VITE_API}/users/email/${formData.email}`)
        const data = await api.data;
        // Update existing user
        const obj  = {
          ...formData,
          id : data.id
        }
        await axios.post(`${import.meta.env.VITE_API}/users`, obj);
        setUsers(users.map(user => user.id === currentUser.id ? {...user, ...formData} : user));
      } else {
        // Create new user
        const { data } = await axios.post(`${import.meta.env.VITE_API}/users/create`, formData);
        setUsers([...users, data]);
      }

      setIsModalOpen(false);
      setFormData({ fullName: '', email: '', password: '', role: 'STUDENT' });
      setCurrentUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API}/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here (clear tokens, etc.)
    navigate('/logout');
  };

  // Open modal for editing
  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: '', // Don't show password when editing
      role: user.role,
    });
    setIsModalOpen(true);
  };

  // Open modal for creating
  const handleCreate = () => {
    setCurrentUser(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      role: 'STUDENT',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Navigation Links */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200">
              <FiHome /> Home
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FiUsers className="text-indigo-400" />
            User Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPlus /> Add User
          </motion.button>
        </header>

        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <motion.div
            layout
            className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-zinc-400">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-zinc-750"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{user.fullName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'ADMIN' 
                              ? 'bg-purple-900 text-purple-200' 
                              : 'bg-blue-900 text-blue-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(user)}
                              className="text-indigo-400 hover:text-indigo-300 p-1"
                            >
                              <FiEdit2 />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(user.id)}
                              className="text-rose-400 hover:text-rose-300 p-1"
                            >
                              <FiTrash2 />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-800 rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {currentUser ? 'Edit User' : 'Create User'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-zinc-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-zinc-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                {!currentUser && (
                  <div className="mb-4">
                    <label className="block text-zinc-300 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required={!currentUser}
                    />
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700"
                  >
                    {currentUser ? 'Update' : 'Create'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;