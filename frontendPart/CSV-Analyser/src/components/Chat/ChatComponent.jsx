import React from 'react'
import { Bot, User } from 'lucide-react';
import Plot from "react-plotly.js";

const ChatComponent = ({Chats}) => {


  return (
    < >
        {Chats.map((message) => (
          <div
            key={message.id}
            className={` flex  ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
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
               <div>{renderMessageContent(message)}</div>
                <span className={`text-xs ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                </span>
              </div>
            </div>
          </div>
        ))}
      </>
  )
}


const renderMessageContent = (message) => {
  if (message.answerFormat === "table") {
    if (Array.isArray(message.text) && message.text.length > 0) {
      const headers = Object.keys(message.text[0]); // Extract column names

      return (
        <table border="1">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {message.text.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td key={colIndex}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  } else if (message.answerFormat === "list") {
    return (
      <ul>
        {Array.isArray(message.text)
          ? message.text.map((item, index) => <li key={index}>{item}</li>)
          : Object.entries(message.text).map(([key, value], index) => (
              <li key={index}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
      </ul>
    );
  } else if(message.answerFormat === 'Plot') {
    console.log(message)
      const plot = JSON.parse(message.text)
      

      return (
          <div  className="bg-white rounded-lg shadow">
                  <div className="p-4" style={{ height: "400px" , width: "400px" }}>
                    {plot?.data && plot?.layout ? (
                      <Plot
                        data={plot.data}
                        layout={plot.layout}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <p>Failed to load graph</p>
                    )}
                  </div>
                </div>
      )
  } else {
    return <p>{message.text}</p>; // Default plain text
  }
};




export default ChatComponent