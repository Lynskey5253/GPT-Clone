import React from "react";
import { Configuration, OpenAIApi } from "openai";
import { useState, useEffect } from 'react';
import ChatMessage from "../Components/ChatMessage";

const Home = () => {
  
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: "Hello! How can I assist you today?"
  }]);
  
  const configuration = new Configuration({
      organization: "org-CoRL9UWVuqf7Q2oSkGjbGdrY",
      apiKey: process.env.REACT_APP_OPENAI_API_KEY
  });

  delete configuration.baseOptions.headers['User-Agent'];

  const openai = new OpenAIApi(configuration);
  
  function clearChat() {
    setChatLog([])
  }

  async function handleSubmit(e){
    e.preventDefault();
    let chatLogNew = [...chatLog, {user: "me", message: `${input}`
    }]
    setInput("")
    setChatLog(chatLogNew);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: `${input}` }],
    });
    
    console.log(response.data.choices[0].message);

    setResult(response.data.choices[0].message.content);
  
    setChatLog([...chatLogNew, { user: "gpt", message: result } ]);
    
  }


  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New chat
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder-wrapper">
          <div className="chat-input-holder">
              <textarea
                placeholder="Send a message..."
                className="chat-input-textarea"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                ></textarea>
              <button className="submit" onClick={handleSubmit}>
                    <svg fill="grey" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"> <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"/>
                    </svg>
              </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;