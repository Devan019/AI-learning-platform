import axios from 'axios'
import { motion } from 'framer-motion'
import { Edit2, MessageSquare, PlusCircle, Send, Trash2 } from 'lucide-react'
import React, { useEffect } from 'react'

const ChatHistory = (
  { allChats, activeChat, setActiveChat, editingChatId, newChatTitle, setNewChatTitle, sidebarOpen, formatChatTitle, setEditingChatId,setAllChats ,setChatTitles, chatTitles, id, createNewChat}
) => {

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    const reply = confirm("Are you sure you want to delete this chat?");
    if (!reply) return;

    try {
      // Delete from backend first
      await axios.delete(
        `${import.meta.env.VITE_API}/chats/user/${id}/${chatId}`,
        { withCredentials: true }
      );

      // Then update local state
      const newChats = { ...allChats };
      delete newChats[chatId];
      setAllChats(newChats);

      const newChatTitles = { ...chatTitles };
      delete newChatTitles[chatId];
      setChatTitles(newChatTitles);

      // Handle active chat if deleted
      if (chatId === activeChat) {
        const remainingChats = Object.keys(newChats);
        setActiveChat(remainingChats[0] || "");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat. Please try again.");
    }
  };


  const changeNameFromDb = async() => {
    const api = await axios.get(`${import.meta.env.VITE_API}/chats/user/${id}/${editingChatId }/update?newname=${newChatTitle}`);
    return api.data;
  }

  const handlechangeNameFromDb = async() => {
     const response  = await changeNameFromDb();
     if(response == null) alert("problem at backend")
  }

  const loadChats = async (topic) => {
    const api = await axios.get(`${import.meta.env.VITE_API}/chats/user/${id}/${topic}`);
    return api.data;
  }


  const handleChatSelect = async (chatId) => {
    try {
      const loadedMessages = await loadChats(chatId);
      
      if (loadedMessages && loadedMessages.length > 0) {
        setAllChats(prev => {
          const existingMessages = prev[chatId] || [];
  
          const newMessages = loadedMessages
            .filter(chat => 
              !existingMessages.some(
                existingMsg => 
                  existingMsg.text === chat.message && 
                  existingMsg.sender === chat.chatFrom
              )
            )
            .map(chat => ({
              text: chat.message, 
              sender: chat.chatFrom
            }));
  
          if (newMessages.length > 0) {
            return {
              ...prev,
              [chatId]: [
                ...existingMessages,
                ...newMessages
              ]
            };
          }
          return prev;
        });
  
        setActiveChat(chatId);
      }
    } catch (error) {
      console.error("Error selecting chat:", error);
    }
  };


  

  const startRenameChat = (chatId, e) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setNewChatTitle(chatTitles[chatId] || formatChatTitle(chatId, allChats[chatId]));
  };

  const saveRenameChat = async (e) => {
    e.preventDefault();
    if (!editingChatId || !newChatTitle.trim()) return;

    try {
      // Update backend first
      await axios.get(
        `${import.meta.env.VITE_API}/chats/user/${id}/${editingChatId}/update?newname=${newChatTitle}`,
        { withCredentials: true }
      );

      // Then update local state
      setChatTitles(prev => ({
        ...prev,
        [editingChatId]: newChatTitle.trim()
      }));

      // If we renamed the active chat, update its messages key
      if (allChats[editingChatId]) {
        const chats = allChats[editingChatId];
        setAllChats(prev => {
          const newChats = { ...prev };
          delete newChats[editingChatId];
          newChats[newChatTitle.trim()] = chats;
          return newChats;
        });

        if (activeChat === editingChatId) {
          setActiveChat(newChatTitle.trim());
        }
      }

      setEditingChatId(null);
      setNewChatTitle("");
      location.reload()
    } catch (error) {
      console.error("Error renaming chat:", error);
      alert("Failed to rename chat. Please try again.");
    }
  };

  const cancelRenameChat = () => {
    setEditingChatId(null);
    setNewChatTitle("");
  };

  return (
    <motion.div
          className="bg-zinc-900 border-r border-zinc-800 h-full overflow-hidden"
          initial={{ width: sidebarOpen ? "250px" : "0px" }}
          animate={{ width: sidebarOpen ? "250px" : "0px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="p-4 flex flex-col h-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createNewChat}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-3 mb-4 w-full"
            >
              <PlusCircle size={18} />
              <span>New Chat</span>
            </motion.button>

            {/* Chat history */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {Object.entries(allChats).map(([chatId, chatMessages]) => (
                <motion.div
                  key={chatId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (editingChatId !== chatId) {
                      handleChatSelect(chatTitles[chatId]);
                    }
                  return editingChatId !== chatId && setActiveChat(chatId)}}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${activeChat === chatId ? "bg-zinc-700" : "bg-zinc-800 hover:bg-zinc-700"
                    }`}
                >
                  {editingChatId === chatId ? (
                    <form onSubmit={saveRenameChat} className="flex-1 flex items-center">
                      <input
                        type="text"
                        value={newChatTitle}
                        onChange={(e) => setNewChatTitle(e.target.value)}
                        className="flex-1 bg-zinc-600 text-white text-sm p-1 rounded outline-none"
                        autoFocus
                        onBlur={cancelRenameChat}
                        onKeyDown={(e) => e.key === "Escape" && cancelRenameChat()}
                      />
                      <button type="submit" className="ml-2 text-green-500">
                        <Send size={14} />
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <MessageSquare size={16} className="text-gray-400 shrink-0" />
                        <span className="text-white text-sm truncate">
                          {formatChatTitle(chatId, chatMessages)}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => startRenameChat(chatId, e)}
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <Edit2 size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => deleteChat(chatId, e)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
  )
}

export default ChatHistory