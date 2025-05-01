import React, { useRef, useState } from "react";
import { addChat } from "@/Store/chat";
import { ToastMessage } from "../Home/ToastMessage";
import axios from "axios";
import { BACKEND_END_POINT } from "@/utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const ChatInput = ( {setLoading} ) => {

  // console.log(setLoading)
  const allChats = useSelector((store) => store.chat);
  const {fileURL} = useSelector(store => store.fileURL)
  const dispatch = useDispatch();
  const [chatType, setChatType] = useState('Text')
  

  const newMessage = useRef(null);



  const handleSend = async (e)=> {
    e.preventDefault();
    if(fileURL === null){
      ToastMessage("No File", "Please choose a File")
      return
    }
    try {

      setLoading(true)

      if (!newMessage.current.value.trim()) return;
    
      const message = {
        id: allChats.length + 1,
        text: newMessage.current.value,
        sender: "user",
        answerFormat : "", 
        chatType 
      };
  
      newMessage.current.value = "";
      dispatch(addChat(message));

      const req = 
        {
          "query": message.text,
           "file_url": fileURL, 
           "chatType":chatType
        }
      
        const response = await axios.post(`${BACKEND_END_POINT}/chat`, req, {
          headers: {
            "Content-Type": "application/json",
          },
            withCredentials: true,
          })
          

          console.log(response.data)

        if(response.data.success){
            const botResponse =  {
              id: allChats.length + 2,
              text: response.data.answer,
              sender: "bot",
              answerFormat: response.data.answerFormat
            };
            
            
            dispatch(addChat(botResponse));

        }else{
            ToastMessage("Error", response.data.message);
        }

    } catch (error) {
        ToastMessage("Error", error.message);
    }finally{
      setLoading( false )
    }
  };

  return (
    <form 
    className="flex flex-col sm:flex-row gap-2 items-center w-full max-w-3xl mx-auto p-3 bg-gray-800 rounded-lg shadow-md"
    onSubmit={handleSend}
  >
    
    {/* Dropdown Menu */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 h-auto flex items-center gap-1"
        >
          {chatType}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-gray-700 text-white border-none rounded-md p-1">
        <DropdownMenuItem 
          className="hover:bg-gray-600 cursor-pointer px-3 py-2 rounded-md text-sm"
          onSelect={() => setChatType('Text')}
        >
          Text
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-600 cursor-pointer px-3 py-2 rounded-md text-sm"
          onSelect={() => setChatType('Plot')}
        >
          Plot
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Textarea Input */}
    <div className="relative flex-1">
      <textarea
        ref={newMessage}
        placeholder="Type your message here..."
        id="message"
        rows="1"
        className="w-full p-3 pl-4 pr-12 bg-gray-900 text-white rounded-lg border-none focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 resize-none overflow-hidden"
      />
      
      {/* Send Button - inside textarea for cleaner look */}
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        aria-label="Send message"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
          <path d="M6 12h16" />
        </svg>
      </button>
    </div>
  </form>  );
};

export default ChatInput;
