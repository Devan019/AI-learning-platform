import { useState } from "react";
import { BackgroundLines } from "../Components/ui/bg-lines";
import { Navbar } from "../Components/Nav";
import { Paperclip } from "lucide-react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  async function apicall() {
    console.log(input);
    const response = await axios.get(
      `http://localhost:8090/api/gemini/chatbot/${input}`
    );
    console.log(response.data);
    const quizdata = response.data;
    const jsontext = quizdata.candidates[0].content.parts[0].text;
    const jsondata = JSON.parse(jsontext.replace(/```json|```/g, "").trim());

    console.log(jsondata);
    return jsondata.reply;
  }

  const sendMessage = async () => {
    if (!input.trim() && !file) return;
  
    const newMessages = [...messages, { text: input, sender: "user", file }];
    setMessages(newMessages); // Update messages with user input
  
    setInput("");
    setFile(null);
  
    const data = await apicall();
    
    setMessages([...newMessages, { text: data, sender: "bot" }]); // Keep previous messages
  };
  

  return (
    <div className="bg-zinc-950 h-screen flex flex-col items-center justify-center relative">
      <Navbar />
      <BackgroundLines className="bg-zinc-950 absolute inset-0" />

      <div className=" z-20 w-[60vw] border-zinc-800 border-2 rounded-lg shadow-lg p-6 flex flex-col space-y-4 h-[70vh] overflow-hidden">
        <h1 className="text-2xl font-bold text-white text-center">Chatbot</h1>
        <div className="flex-1 overflow-y-auto space-y-3 p-2 scrollbar-thin scrollbar-thumb-gray-600">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs text-white text-sm shadow-md ${
                  msg.sender === "user" ? "bg-blue-500" : "bg-gray-700"
                }`}
              >
                {msg.text}
                {msg.file && (
                  <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                    📎 {msg.file.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
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
            className="flex-1 p-3 bg-zinc-800 text-white rounded-lg outline-none"
            onKeyUp={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
