import React, { useState } from "react";
import ChatInput from "./ChatInput";
import "./Chat.css";
import ChatComponent from "./ChatComponent";
import { useDispatch, useSelector } from "react-redux";
import {  clearChat } from "@/Store/chat";
import { Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

const Chat = () => {  

  const allChats = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  console.log(loading)

  return (
    <div className="h-[89vh] w-full flex flex-col justify-center items-center relative">
      {allChats.length === 0 ? (
        <div className=" w-full flex justify-center items-center">
          
          <ChatInput setLoading={setLoading} />

        </div>
      ) : (
        <div className="h-full w-full flex flex-col gap-9 justify-between items-center m-10">
          <div className="w-[100%] relative overflow-y-auto ">
            <ChatComponent Chats={allChats} />
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%] flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                    <Bot className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row gap-2 items-center bg-gray-800 rounded-lg shadow-md p-1">
      {/* New Chat Button */}
      <Button
        onClick={() => dispatch(clearChat([]))}
        variant="ghost"
        className="flex items-center gap-2 text-white hover:bg-gray-700  h-auto whitespace-nowrap text-md"
      >
        <CirclePlus className="w-5 h-5" />
      </Button>

      {/* Chat Input */}
      <div className="flex-1">
        <ChatInput setLoading={setLoading} />
      </div>
    </div>

        </div>
      )}
    </div>
  );
};

export default Chat;
