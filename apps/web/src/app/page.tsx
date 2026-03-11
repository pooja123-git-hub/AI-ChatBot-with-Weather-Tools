//   'use client';
//   import { DefaultChatTransport } from 'ai';
//   import { useChat } from '@ai-sdk/react';
//   import { useState,useRef } from 'react';
// import WeatherCard from '../../components/WeatherCard';
// import Home from '../../components/Home';

//   export default function Page() {
//     const [selectedModel, setSelectedModel] = useState(
//       "gemini-2.5-flash-lite"
//     );
// const selectedModelRef=useRef(selectedModel)
// selectedModelRef.current=selectedModel;
// const [input, setInput] = useState('');

//     const { messages, sendMessage, status } = useChat({
//       transport: new DefaultChatTransport({
//         api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
//         // body: { model: selectedModel },
//         body:()=>({ model: selectedModelRef.current})
//       }),
//     });

//   return (
//     <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      
//       {/* Model Selection */}
//       <div className="mb-4">
//         <label
//           className="block text-sm font-medium text-gray-400 mb-2"
//           htmlFor="model-input"
//         >
//           Select AI Model:
//         </label>

//         <input
//           id="model-input"
//           type="text"
//           value={selectedModel}
//           onChange={(e) => setSelectedModel(e.target.value)}
//           className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
//         />
//       </div>

//      <div className="flex-1 overflow-y-auto mb-4 space-y-4">

//   {messages.length === 0 && <Home />}

//   {messages.map((message) => (
//     <div
//       key={message.id}
//       id={message.id}
//       className={`flex ${
//         message.role === 'user' ? 'justify-end' : 'justify-start'
//       }`}
//     >
//             <div
//               className={`max-w-[80%] rounded-lg px-4 py-2 ${
//                 message.role === 'user'
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-800 text-gray-100'
//               }`}
//             >
//               <div className="text-xs font-semibold mb-1 opacity-70">
//                 {message.role === 'user' ? 'You' : 'Assistant'}
//               </div>

//               <div className="space-y-3">
//                 {message.parts.map((part, index) => {
//                   if (part.type === 'text') {
//                     return (
//                       <div key={index} className="whitespace-pre-wrap">
//                         {part.text}
//                       </div>
//                     );
//                   }
//                   if(part.type==='tool-getWeather' && part.state==='output-available' ){
//                     return (
//                       <WeatherCard key={index} data={part.output as any} />
//                     )
//                   }
//                   return null;
//                 })}
//               </div>

//             </div>
//           </div>
//         ))}
//         {
//           status !== 'ready' && (
//             <div className="flex justify-start">
//               <div className='bg-gray-800 text-gray-100 rounded-lg px-4 py-2'>
//                 <div
//                 className='flex items-center space-x-2'>
//                   <div
//                   className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                   style={{animationDelay:'0ms'}}>

//                   </div>
//                   <div
//                   className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
//                   style={{animationDelay:"150ms"}}></div>
//                   <div
//                   className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
//                   style={{animationDelay:"300ms"}}></div>
//                 </div>
//               </div>
//             </div>
//           )
//         }
//         </div>
//         <form
//         onSubmit={(e)=>{
//           e.preventDefault();
//           if(input.trim()){
//             sendMessage({text:input})
//             setInput("")
//           }
//         }}
//         className='flex gap-2'>
//           <input 
//           type='text'
//           value={input}
//           onChange={(e)=>setInput(e.target.value)}
//           placeholder='Type your message...'
//           className='flex-1 px-4 py-2 bg-gray-900 border-gray-700 rounded-lg text-white placeholder-gray-500'
//   />
//   <button
//   type='submit'
//   disabled={status !== 'ready' || !input.trim()}
//   className='px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed  transition-colors'>
//     Send
//   </button>
//         </form>
//       </div>

//   );
//   }
'use client';

import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import WeatherCard from '../../components/WeatherCard';
import Home from '../../components/Home';

export default function Page() {

  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash-lite");

  const selectedModelRef = useRef(selectedModel);
  selectedModelRef.current = selectedModel;

  const [input, setInput] = useState('');

  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
      body: () => ({ model: selectedModelRef.current })
    }),
  });

  /* ---------------------------
     LOAD CHATS FROM LOCALSTORAGE
  ----------------------------*/
  useEffect(() => {

    const storedChats = localStorage.getItem('ai-chats');
    const storedActiveChat = localStorage.getItem('active-chat');

    if (storedChats) {

      const parsedChats = JSON.parse(storedChats);
      setChats(parsedChats);

      if (storedActiveChat) {

        setActiveChatId(storedActiveChat);

        const active = parsedChats.find((c: any) => c.id === storedActiveChat);

        if (active) {
          setMessages(active.messages || []);
        }

      }

    }

  }, []);

  /* ---------------------------
     SAVE CHATS
  ----------------------------*/
  useEffect(() => {
    localStorage.setItem('ai-chats', JSON.stringify(chats));
  }, [chats]);

  /* ---------------------------
     SAVE ACTIVE CHAT
  ----------------------------*/
  useEffect(() => {

    if (activeChatId) {
      localStorage.setItem('active-chat', activeChatId);
    }

  }, [activeChatId]);

  /* ---------------------------
     SYNC CHAT MESSAGES
  ----------------------------*/
  useEffect(() => {

    if (!activeChatId) return;

    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages }
          : chat
      )
    );

  }, [messages, activeChatId]);

  /* ---------------------------
     ACTIVE CHAT
  ----------------------------*/
  const activeChat = chats.find(c => c.id === activeChatId);
  const displayedMessages = activeChat ? activeChat.messages : messages;

  return (

    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 p-4 space-y-3">

        <button
          className="w-full bg-blue-600 text-white p-2 rounded cursor-pointer"
          onClick={() => {

            setActiveChatId(null);
            setMessages([]);
            localStorage.removeItem('active-chat');

          }}
        >
          + New Chat
        </button>

        {chats.map(chat => (

          <div
            key={chat.id}
            className="flex items-center justify-between text-gray-300 hover:bg-gray-800 p-2 rounded"
          >

            <span
              className="cursor-pointer flex-1"
              onClick={() => {

                setActiveChatId(chat.id);
                setMessages(chat.messages);

              }}
            >
              {chat.title}
            </span>

            <button
              onClick={() => {

                const filtered = chats.filter(c => c.id !== chat.id);
                setChats(filtered);

                if (activeChatId === chat.id) {
                  setActiveChatId(null);
                  setMessages([]);
                }

              }}
              className="text-blue-400 text-xs ml-2"
            >
              ✕
            </button>

          </div>

        ))}

      </div>

      {/* MAIN CHAT */}
      <div className="flex flex-col flex-1 max-w-3xl mx-auto p-4">

        {/* MODEL SELECT */}
        <div className="mb-4">

          <label className="block text-sm font-medium text-gray-400 mb-2">
            Select AI Model:
          </label>

          <input
            type="text"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          />

        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">

          {!activeChatId && messages.length === 0 && <Home />}

          {displayedMessages.map((message: any) => (

            <div
              key={message.id}
              className={`flex ${
                message.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >

              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >

                <div className="text-xs font-semibold mb-1 opacity-70">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </div>

                <div className="space-y-3">

                  {message.parts?.map((part: any, index: number) => {

                    if (part.type === 'text') {
                      return (
                        <div key={index} className="whitespace-pre-wrap">
                          {part.text}
                        </div>
                      );
                    }

                    if (part.type === 'tool-getWeather' && part.state === 'output-available') {
                      return (
                        <WeatherCard
                          key={index}
                          data={part.output as any}
                        />
                      );
                    }

                    return null;

                  })}

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* INPUT */}
        <form
          onSubmit={(e) => {

            e.preventDefault();

            if (!input.trim()) return;

            sendMessage({ text: input });

            if (!activeChatId) {

              const newChat = {
                id: Date.now().toString(),
                title: input.slice(0, 30),
                messages: []
              };

              setChats(prev => [...prev, newChat]);
              setActiveChatId(newChat.id);

            }

            setInput("");

          }}
          className="flex gap-2"
        >

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-gray-900 border-gray-700 rounded-lg text-white placeholder-gray-500"
          />

          <button
            type="submit"
            disabled={status !== 'ready'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>

        </form>

      </div>

    </div>

  );
}