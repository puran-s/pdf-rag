'use client'

import * as React from 'react';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';

interface Doc {
  pageContents?: string;
  metadata?:{
    loc?:{
      pageNumber?:number;
    };
    source?:string;
  }
}
interface IMessage{
  role:'assistant'|'user';
  content?:string;
  documents?:Doc[];
}

const ChatComponent: React.FC = () => {
   const [message, setMessage] = React.useState<string>('');
   const [messages, setMessages] = React.useState<IMessage[]>([]);

   const handleSendChatMessage=async() => {
   
    const url='http://localhost:8000/chat?message='+message;
    
    setMessages((prev) => [...prev, {role:'user', content:message}]);
    const res = await fetch(url)
    const data=await res.json();
 
        setMessages((prev) => [...prev, 
          {
            role:'assistant', 
            content:data?.message,
            documents:data?.docs,
          },
        ]);
      
   }
    return (
        <div className='p-4'>
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <strong>{message.role}:</strong> {message.content}
              {message.documents?.[0]?.metadata?.source && (
                <div style={{ fontSize: '0.8em', color: '#555', marginTop: '5px' }}>
                  Source: {message.documents[0].metadata.source}
                  {message.documents[0].metadata.loc?.pageNumber && `, Page Number: ${message.documents[0].metadata.loc.pageNumber}`}
                </div>
              )}
            </div>
          ))}
        </div >
        <div className="chat-input-area">
          <div className='fixed bottom-4 w-100 flex gap-3 chat-input-container' >
          <Input  className="chat-input-field"
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          onKeyDown={(e) => { // Added onKeyDown handler
            if (e.key === 'Enter' && message.trim()) { // Check if Enter key is pressed and message is not empty
              e.preventDefault(); // Prevent default form submission or newline
              handleSendChatMessage(); // Call the send message function
            }
          }}
          placeholder="Type you message here" />
          <Button className="chat-send-button" onClick={handleSendChatMessage} disabled={!message.trim()}>Send</Button>
        </div>
        </div>
        </div>
    );
};
export default ChatComponent;