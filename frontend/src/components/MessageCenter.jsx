import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Send, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const MessageCenter = ({ bookingId, otherUser, trigger }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && bookingId) {
      fetchMessages();
    }
  }, [open, bookingId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/booking/${bookingId}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          booking_id: bookingId,
          receiver_id: otherUser.id,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Chat with {otherUser?.full_name || otherUser?.username}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender_id === user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center justify-end mt-1 text-xs ${
                    message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(message.created_at).toLocaleTimeString()}
                    {message.sender_id === user?.id && message.is_read && (
                      <CheckCircle2 className="w-3 h-3 ml-1" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={sendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};