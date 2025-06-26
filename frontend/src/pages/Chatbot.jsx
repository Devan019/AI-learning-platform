import { useState, useEffect } from "react";
import { BackgroundLines } from "../Components/ui/bg-lines";
import { Navbar } from "../Components/Nav";
import { Paperclip, Send } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import ChatHistory from "../Components/ChatHistory";
import ReactMarkDown from "react-markdown"
import { AdminLink } from "../Components/AdminLink";
const Chatbot = () => {
  const [activeChat, setActiveChat] = useState("New Conversation");
  const [allChats, setAllChats] = useState([]);
  const { id, email, loading, error } = useSelector((state) => state.getUser);

  const [loader, setLoader] = useState(false);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatTitles, setChatTitles] = useState({
    "New Conversation": "New Conversation"
  });
  const [editingChatId, setEditingChatId] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState("");


  const messages = allChats[activeChat] || [];

  const saveConvertions = async (Chat) => {
    const api = await axios.post(`${import.meta.env.VITE_API}/chats/user/${id}/${activeChat}`,Chat,{withCredentials : true})

    return api.data;

    // console.log(id, activeChat)
  }
  const geminiResponse = async (input) => {
    try {
      const api = await axios.get(`${import.meta.env.VITE_API}/gemini/chatbot/${input}`,{withCredentials : true});
      const geminiReply = api.data;
      // console.log("Raw Gemini response:", geminiReply);
      
      // // Handle different response formats
      // let jsonText;
      // if (geminiReply.candidates && geminiReply.candidates[0]?.content?.parts[0]?.text) {
      //   jsonText = geminiReply.candidates[0].content.parts[0].text;
      // } else if (geminiReply.text) {
      //   // If response is already in the expected format
      //   return { reply: geminiReply.text };
      // } else {
      //   // If response is a simple string
      //   return { reply: JSON.stringify(geminiReply) };
      // }
  
      // Clean and parse the JSON
      const cleanedText = geminiReply.replace(/```json|```/g, "").trim();
      console.log("Cleaned text:", cleanedText);
      
      try {
        const jsondata = JSON.parse(cleanedText);
        console.log("Parsed JSON data:", jsondata);
        return jsondata;
      } catch (parseError) {
        console.error("Failed to parse JSON, returning raw text:", parseError);
        return { reply: cleanedText };
      }
    } catch (error) {
      console.error("Error getting Gemini response:", error);
      return { reply: "Sorry, I couldn't process your request. Please try again." };
    }
  };
  
  const sendMessage = async () => {
    if (!input.trim() && !file) return;
  
    const newMessages = [...messages, { text: input, sender: "USER", file }];
    setAllChats(prev => ({
      ...prev,
      [activeChat]: newMessages
    }));
    
    setInput("");
    setFile(null);
  
    try {
      setLoader(true);
      const data = await geminiResponse(input);
      const responseText = data.reply || JSON.stringify(data);
      
      setAllChats(prev => ({
        ...prev,
        [activeChat]: [...newMessages, { text: responseText, sender: "GEMINI" }]
      }));
  
      // Save conversations
      try {
        const userChatSave = await saveConvertions({ chatFrom: "USER", message: input });
        if (!userChatSave) console.error("Failed to save user chat");
        
        const geminiResponseSave = await saveConvertions({ 
          chatFrom: "GEMINI", 
          message: responseText 
        });
        if (!geminiResponseSave) console.error("Failed to save Gemini response");
      } catch (saveError) {
        console.error("Error saving conversation:", saveError);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setAllChats(prev => ({
        ...prev,
        [activeChat]: [...newMessages, { 
          text: "Sorry, an error occurred. Please try again.", 
          sender: "GEMINI" 
        }]
      }));
    } finally {
      setLoader(false);
    }
  };


  const getTitels = async () => {
    const api = await axios.get(`${import.meta.env.VITE_API}/chats/user/${id}/topics`,{withCredentials: true});
    return api.data;
  }
  const createNewChat = () => {
    // Find all existing chat numbers
    const existingNumbers = Object.keys(chatTitles)
      .map(title => {
        const match = title.match(/New Chat (\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => !isNaN(num));
    
    // Find the highest existing number
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    
    // Create new chat with next available number
    const chatId = `New Chat ${maxNumber + 1}`;
    
    setAllChats(prev => ({
      ...prev,
      [chatId]: [{ text: "Hello! How can I help you today?", sender: "GEMINI" }]
    }));
    
    setChatTitles(prev => ({
      ...prev,
      [chatId]: chatId
    }));
    
    setActiveChat(chatId);
  };
  const loadChats = async (topic) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/chats/user/${id}/${topic}`,
        {withCredentials: true}
      );
      return response.data || [];
    } catch (error) {
      console.error("Error loading chats:", error);
      return [];
    }
  };



  const main = async () => {
    try {
      setLoader(true);
      const titles = await getTitels();
      
      if (!titles || titles.length === 0) {
        createNewChat();
        return;
      }

      // Initialize chats with actual data from backend
      const newChats = {};
      const newTitles = {};
      
      for (const title of titles) {
        const chats = await loadChats(title);
        newChats[title] = chats.map(chat => ({
          text: chat.message,
          sender: chat.chatFrom,
          file: null
        }));
        newTitles[title] = title;
      }

      setAllChats(newChats);
      setChatTitles(newTitles);
      
      // Set first chat as active if available
      const firstChatId = titles[0];
      if (firstChatId) {
        setActiveChat(firstChatId);
      }
    } catch (error) {
      console.error("Error initializing chats:", error);
      createNewChat();
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (id) {
      main();
      console.log(id)
    }
  }, [id])



  const formatChatTitle = (chatId, messages) => {
    if (chatTitles[chatId]) return chatTitles[chatId];

    if (chatId === "New Conversation") return "New Conversation";

    const firstUserMessage = messages.find(msg => msg.sender === "USER");
    if (firstUserMessage) {
      const title = firstUserMessage.text.slice(0, 20);
      return title.length < firstUserMessage.text.length ? `${title}...` : title;
    }

    return "New Conversation";
  };

  return (
    <div className="bg-black h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Navbar />
      <AdminLink />
      <BackgroundLines className="bg-black absolute inset-0" />

      <div className="z-20 w-full max-w-6xl h-[80vh] flex relative mt-16">
        {/* Sidebar */}
        <ChatHistory
          allChats={allChats}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          editingChatId={editingChatId}
          newChatTitle={newChatTitle}
          setNewChatTitle={setNewChatTitle}
          chatTitles={chatTitles}
          formatChatTitle={formatChatTitle}
          sidebarOpen={sidebarOpen}
          setChatTitles={setChatTitles}
          setAllChats={setAllChats}
          setEditingChatId={setEditingChatId}
          id={id}
          createNewChat={createNewChat}
        />


        {/* Main chat area */}
        <motion.div
          className="flex-1 border-zinc-800 border-2 rounded-lg shadow-lg flex flex-col overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white p-1"
            >
              {/* Sidebar Icon */}
              {sidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
            <h1 className="text-xl font-bold text-white">
              {formatChatTitle(activeChat, messages)}
            </h1>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-4 scrollbar-thin scrollbar-thumb-gray-600">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${msg.sender === "USER" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[80%] break-words text-white shadow-md ${msg.sender === "USER"
                    ? "bg-gradient-to-r from-purple-600 to-blue-500"
                    : "bg-gradient-to-r from-zinc-700 to-zinc-800"
                    }`}
                >
                  <ReactMarkDown>{msg.text}</ReactMarkDown>
                  {msg.file && (
                    <div className="mt-2 p-2 bg-zinc-800 rounded text-xs flex items-center gap-1">
                      <Paperclip size={12} />
                      {msg.file.name}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input and send button */}
          <motion.div
            className="p-4 border-t border-zinc-800"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2 bg-zinc-800 rounded-lg p-1 pl-3">
              <label className="cursor-pointer text-gray-400 hover:text-white">
                <Paperclip size={20} />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 bg-transparent text-white outline-none"
                onKeyUp={(e) => e.key === "Enter" && sendMessage()}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-2 rounded-lg"
              >
                <Send size={20} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;