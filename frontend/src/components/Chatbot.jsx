import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await axios.get('http://localhost:4000/api/v1/store/search-data-by-title', {
        params: { title: input }
      });

      if (response.status === 200 && response.data.length > 0) {
        const data = response.data[0];
        const botMessage = {
          role: 'bot',
          title: data.title,
          content: data.content,
          image: data.image
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } else {
        throw new Error('No data found, falling back to Dialogflow');
      }
    } catch (error) {
      try {
        const [fallbackResponse, imageResponse] = await Promise.all([
          axios.post('http://localhost:4000/api/v1/dialogflow/webhook', {
            text: input,
            fulfillmentInfo: { tag: 'askGemini' },
            sessionInfo: { sessionId: '12345', parameters: { chatHistory: [] } }
          }),
          axios.get('http://localhost:4000/api/v1/google/search-images', {
            params: { title: input }
          })
        ]);

        const images = imageResponse.data.slice(0, 3).map(item => item.link);

        if (fallbackResponse.data.fulfillmentResponse && fallbackResponse.data.fulfillmentResponse.messages) {
          const responseText = fallbackResponse.data.fulfillmentResponse.messages[0].text.text.join(' ');
          const formattedText = formatResponseText(responseText);

          const botMessage = {
            role: 'bot',
            content: formattedText,
            images: images
          };
          setMessages(prevMessages => [...prevMessages, botMessage]);
        } else {
          throw new Error('Invalid response from Dialogflow API');
        }
      } catch (dialogflowError) {
        const errorMessage = {
          role: 'bot',
          text: 'Sorry, something went wrong. Please try again later.'
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    }
  };

  const formatResponseText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const structuredContent = lines.map((line, index) => {
      if (line.startsWith('**')) {
        return <h3 key={index} className="font-bold text-xl mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
      }
      if (line.startsWith('* ')) {
        return <li key={index} className="ml-5 list-disc">{line.replace('* ', '')}</li>;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });

    return <div className="text-gray-800">{structuredContent}</div>;
  };

  useEffect(() => {
    const messagesContainer = document.querySelector('.messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x bg-cover p-6">
      <div className="chatbot-container p-8 bg-white bg-opacity-90 border border-gray-300 rounded-2xl max-w-3xl w-full mx-auto shadow-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800 animate-pulse">Chat Bot App</h1>
        <div className="messages space-y-6 mb-6 max-h-96 overflow-y-auto rounded-xl bg-gray-100 p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message p-6 rounded-xl shadow-md transition-transform duration-500 ease-in-out transform ${
                msg.role === 'user' ? 'bg-indigo-100 self-end translate-x-0' : 'bg-blue-100 self-start -translate-x-0'
              }`}
            >
              {msg.title && <h3 className="font-bold text-xl mb-2 text-indigo-700">{msg.title}</h3>}
              {msg.content}
              {msg.image && <img src={msg.image} alt={msg.title} className="mt-4 max-w-full h-auto rounded-lg shadow-md" />}
              {msg.text && <p className="text-base text-gray-700">{msg.text}</p>}
              {msg.images && msg.images.map((image, i) => (
                <img key={i} src={image} alt={`Additional ${i}`} className="mt-4 max-w-full h-auto rounded-lg shadow-md" />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
            className="input-field flex-grow p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          />
          <button
            onClick={sendMessage}
            className="send-button p-4 ml-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 animate-bounce"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;