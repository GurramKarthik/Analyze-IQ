import React, { useState } from "react";
import ChatInput from "./ChatInput";
import "./Chat.css";
import ChatComponent from "./ChatComponent";
import { useDispatch, useSelector } from "react-redux";
import {  clearChat } from "@/Store/chat";
import { Bot } from 'lucide-react';
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
            {
              loading && (
                  <div className="flex  justify-start" >
                    <div className={`flex items-start space-x-2 max-w-[80%] 'flex-row' `}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center 'bg-gray-100'`}>
                          <Bot className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                    </div>
                )
            } 
          </div>

          <div className="w-full flex flex-row gap-5 justify-center items-center">
            <button onClick={()=>{  dispatch(clearChat([]))} }>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f1f1f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-plus"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
            </button>  
            <ChatInput setLoading={setLoading} />
          </div>

        </div>
      )}
    </div>
  );
};

export default Chat;
