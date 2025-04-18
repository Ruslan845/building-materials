import React, { HTMLInputTypeAttribute, useState } from 'react';
import Emoji from './Emoji';
import { fetchChatGPTResponse } from '@/api/Chatbot';

const Chatbox: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<{ msg: string, user: string }[]>([{msg:"Hello! Can I help you?", user : "bot"}]);
    const [emoji, setEmoji] = useState<boolean>(false);

    const handleSend = async () => {
        if (!message) return;
    
        if (message.trim()) {
            // Use functional updates to get the latest state
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages, { msg: message, user: "me" }];
                return updatedMessages; // Return the updated state
            });
    
            try {
                const response = await fetchChatGPTResponse(message);
                // Update messages with the bot's response
                setMessages(prevMessages => [
                    ...prevMessages,
                    { msg: response, user: "bot" }
                ]);
            } catch (error) {
                console.error("Failed to fetch response:", error);
            }
    
            setMessage(''); // Clear the input field
        }
    };
    const handleEmojiClick = (emoji: string) => {
        setMessage((prev) => prev + emoji);
        setEmoji(!emoji)
    };
    const handlefile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setMessage(file.name);
    }
    return (
        <div className="flex flex-col bg-gray-100 w-96 h-[500px] relative">
            <div className="bg-white shadow-md p-4">

                <div className="box-header">
                    <div className="w-[55px] pull-right avatar">
                        <span title="" data-container="body" rel="tooltip" data-placement="auto left" data-original-title="PSDFILE1988">
                            <img src="https://cdn.goftino.com/static/assets/img/profile.png" alt="avatar" width="40" height="40" />
                        </span>
                    </div>
                    <div className="pull-right box-title">
                        <div className="title-name">
                            Support
                        </div>
                        <div className="title-text">
                            Please ask you any question
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.user == "bot" ? "justify-start" : "justify-end"} mb-4`}>
                        <div className="bg-blue-400 text-white p-3 rounded-lg rounded-br-none">
                            {msg.msg}
                        </div>
                        {/* <div>
                            {msg.}
                        </div> */}
                    </div>
                ))}
            </div>
            <div className='absolute inset-x-0 bottom-[70px] left-0 bg-white duration-500 ease-in-out data-closed:opacity-0 cursor-auto' style={{ display: emoji ? "block" : "none" }}>
                <Emoji handleEmojiClick={handleEmojiClick} />
            </div>
            <div className="p-2 border-t bg-white flex items-center">
                <div className="btn btn-simple btn-file fileinput-new relative overflow-hidden ">
                    <span className="h-10 w-10">
                        <svg fill="#999999" height="24" viewBox="0 0 24 24" width="23" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"></path>
                        </svg>
                    </span>
                    <input type="file" onChange={handlefile} className='absolute top-0 right-0 w-full h-full m-0 text-[23px] cursor-pointer opacity-0 direction-ltr' id="upload-input" name="uploads[]" />
                </div>
                <div className='mr-2' onClick={() => setEmoji(!emoji)}>
                    <svg fill="#bababa" height="24" viewBox="0 0 22 22" width="22" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.5,0,10-4.5,10-10S17.5,2,12,2z M12,21c-4.9,0-9-4.1-9-9c0-5,4.1-9,9-9s9,4.3,9,9 C21,16.7,16.8,21,12,21z M15.5,11c0.8,0,1.5-0.7,1.5-1.5S16.3,8,15.5,8S14,8.7,14,9.5S14.7,11,15.5,11z M8.5,11 c0.8,0,1.5-0.7,1.5-1.5S9.3,8,8.5,8S7,8.7,7,9.5S7.7,11,8.5,11z M12,17.5c2.3,0,4.3-1.5,5.1-3.5H6.9C7.7,16,9.7,17.5,12,17.5z"></path>
                    </svg>
                </div>
                <textarea
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border rounded-md p-2 flex-1 h-14 resize-none"
                    onKeyUp={(e) => { if (e.key == "Enter") { e.preventDefault(); handleSend(); setMessage(''); } }}
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white rounded-md p-2 ml-2 hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbox;  