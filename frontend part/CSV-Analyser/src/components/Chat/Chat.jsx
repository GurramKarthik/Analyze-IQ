import React, { useRef, useState } from 'react'
import ChatInput from './Input'
import "./Chat.css"
import SendBtn from './Send'
import Messages from './Messages'
import ChatComponent from './Messages'




const RandomChat = [
  {
    id: 1,
    text: "Hey there! How can I help you today?",
    sender: "bot",
    timestamp: "10:00 AM"
  },
  {
    id: 2,
    text: "I need help with my account settings",
    sender: "user",
    timestamp: "10:01 AM"
  },
  {
    id: 3,
    text: "Of course! What specific settings would you like to change?",
    sender: "bot",
    timestamp: "10:01 AM"
  },
  {
    id: 4,
    text: "I want to update my email address",
    sender: "user",
    timestamp: "10:02 AM"
  },
  {
    id: 5,
    text: "I can help you with that. Please go to Settings > Profile > Email to update your email address. Is there anything else you'd like to know?",
    sender: "bot",
    timestamp: "10:02 AM"
  }
];


const Chat = () => {

  const [, forceRender] = useState(0);
  const Messages = useRef(RandomChat);
  const newMessage = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.current.value.trim()) return;
    
    const message = {
      id: Messages.current.length + 1,
      text: newMessage.current.value,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    newMessage.current.value=""
    Messages.current.push(message);
    forceRender( prev => prev+1);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Messages.current.length + 2,
        text: "Thanks for your message! I'll get back to you soon.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      Messages.current.push(botResponse);
      forceRender( prev => prev+1);
    }, 1000);
  };
  


  return (
    <div className='bg-background relative flex flex-col justify-center items-center p-4 bg-background-400 mt-10 h-[77vh]'>
      <div className='flex-1 overflow-y-auto pl-2 pr-2'>
          <ChatComponent Chats={Messages.current} />
      </div>
      <form className='flex gap-2 fixed bottom-7 m-auto w-[50%] rounded items-center'>
          <ChatInput newMessage={newMessage} />
          <SendBtn handleSend={handleSend} />
      </form>
    </div>
  )
}

export default Chat