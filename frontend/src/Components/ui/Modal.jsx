import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, onSubmit, levels , courseName, courseLevel, setCourseName,setCourseLevel }) => {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ courseName, courseLevel });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-zinc-900 p-8 rounded-2xl w-[450px] shadow-2xl border border-zinc-700 relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-white text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Generate New Course
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-zinc-300 mb-2 font-medium">Course Name</label>
                <motion.input
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.5)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full p-3 bg-zinc-800 text-white rounded-xl border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-zinc-500"
                  required
                  placeholder="Enter course name"
                />
              </div>
              
              <div className="relative">
                <label className="block text-zinc-300 mb-2 font-medium">Course Level</label>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex justify-between items-center p-3 bg-zinc-800 text-white rounded-xl border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span>{courseLevel}</span>
                    <motion.span
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </motion.span>
                  </button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg overflow-hidden"
                      >
                        {levels.map((level) => (
                          <li key={level}>
                            <button
                              type="button"
                              onClick={() => {
                                setCourseLevel(level);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 hover:bg-zinc-700 transition-colors ${
                                courseLevel === level 
                                  ? "bg-indigo-600 text-white" 
                                  : "text-zinc-300"
                              }`}
                            >
                              {level}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              
              <div className="flex justify-between space-x-4 pt-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.03, backgroundColor: "#3f3f46" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 bg-zinc-700 text-zinc-300 rounded-xl font-medium transition-all"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ 
                    scale: 1.03,
                    backgroundColor: "#6366f1",
                    boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)"
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium transition-all"
                >
                  Create Course
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;