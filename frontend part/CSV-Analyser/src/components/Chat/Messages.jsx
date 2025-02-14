import React from 'react'
import { Bot, User } from 'lucide-react';

const ChatComponent = ({Chats}) => {
  return (
    <div >
        {Chats.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                ${message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {message.sender === 'user' ? 
                  <User className="w-5 h-5 text-blue-600" /> : 
                  <Bot className="w-5 h-5 text-gray-600" />
                }
              </div>

              
              <div
                className={`rounded-lg p-3 mt-2 Messagebox  ${
                  message.sender === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-background-100 text-background-900'
                }`}
              >
                <p>{message.text}</p>
                {console.log(message.text)}
                <span className={`text-xs ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
  )
}

export default ChatComponent