import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { FaUserShield } from 'react-icons/fa';

// Admin link component
const AdminLink = () => (
  <div className="fixed bottom-4 right-4 z-50">
    <a 
      href="/admin"
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
    >
      <FaUserShield className="text-lg" />
      <span className="hidden sm:inline">Admin Dashboard</span>
    </a>
  </div>
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <AdminLink />
    </BrowserRouter>
  </Provider>
);