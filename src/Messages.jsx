import React, { useEffect, useState } from 'react';
import { api } from './api';
import toast from 'react-hot-toast';
import { Mail, User, Trash2 } from 'lucide-react';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await api.admin.getMessages();
      const data = response.data || response;
      
      if (Array.isArray(data)) {
        
        const activeMessages = data.filter(msg => msg.status !== 'Archived');
        setMessages(activeMessages);
      }
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will hide the message from the list.")) return;

    
    toast.promise(
      api.admin.patchMessage(id, "Archived"), 
      {
        loading: 'Processing request...',
        success: () => {
          
          setMessages(prev => prev.filter(msg => msg.id !== id));
          return 'Message deleted successfully';
        },
        error: (err) => {
          console.error("Patch Error:", err);
          return 'Server rejected the update. Please try again.';
        }
      }
    );
  };

  if (loading) return <div className="text-center py-20 text-green-700 font-bold">Loading...</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-left" dir="ltr">
      <h1 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 text-green-800 border-b pb-4">
        <Mail /> User messages
      </h1>

      <div className="grid gap-6">
        {messages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow border border-dashed">
            <p className="text-gray-400">No active messages available</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 relative group transition-all hover:shadow-md">
              
              <button 
                onClick={() => handleDelete(msg.id)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={20} />
              </button>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full text-green-700">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 leading-none">
                      {msg.senderFirstName} {msg.senderLastName}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">{msg.senderEmail}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50/50 p-4 rounded-xl border-l-4 border-blue-500 max-w-full md:max-w-[80%]">
                  <p className="text-gray-700 break-all whitespace-pre-wrap leading-relaxed italic">
                    "{msg.body}"
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}