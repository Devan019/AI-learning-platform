import { FaUserShield } from "react-icons/fa";

export const AdminLink = () => (
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