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


const renderValue = (value) => {
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      return <ul className="list-disc pl-5">{value.map((item, i) => <li key={i}>{renderValue(item)}</li>)}</ul>;
    } else {
      return (
        <ul className="list-none pl-3 text-sm">
          {Object.entries(value).map(([key, val]) => (
            <li key={key}>
              <strong>{key}:</strong> {renderValue(val)}
            </li>
          ))}
        </ul>
      );
    }
  }
  return String(value);
};



const renderMessageContent = (message) => {

  // const [isHovered, setIsHovered] = useState(false);

  if (message.answerFormat === "table") {
    if (Array.isArray(message.text) && message.text.length > 0) {
      const headers = Object.keys(message.text[0]); // Extract column names
  
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <thead>
              <tr className="bg-gray-300">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {message.text.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-200 bg-[#f2f2f2] transition-colors duration-150"
                >
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {renderValue(row[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }else if (message.answerFormat === "list") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-w-2xl w-full animate-fadeIn">
    <ul className="space-y-2 text-gray-700">
      {Array.isArray(message.text)
        ? message.text.map((item, index) => (
            <li key={index} className="text-sm sm:text-base">
              • {item}
            </li>
          ))
        : Object.entries(message.text).map(([key, value], index) => (
            <li key={index} className="flex justify-between items-start py-1">
              <span className="font-medium text-gray-800">{key}:</span>
              <span className="ml-4 text-right max-w-xs truncate">{value}</span>
            </li>
          ))
      }
    </ul>
  </div>
    );
  } else if(message.answerFormat === 'Plot') {
    console.log(message)
      const plot = JSON.parse(message.text)
      
  
        return (
          <div  className="bg-white rounded-lg shadow">
                  <div className="p-4 " style={{ height: "560px" , width: "560px" }}>
                    {plot?.data && plot?.layout ? (
                      <div className='w-full h-full relative'   
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                        >
                        <Plot
                          data={plot.data}
                          layout={plot.layout}
                          style={{ width: "100%", height: "100%" }}
                          
                        />
                     {/* {isHovered && (
                        <button 
                          onClick={handleAddToDashboard} 
                          className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
                        >
                          Add to dashboard
                        </button>
                      )} */}

                      </div>
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