import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCenter } from '../components/MessageCenter';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Search, Clock, CheckCircle2 } from 'lucide-react';

export const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/conversations', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.tool?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to view your messages.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="w-8 h-8 mr-3" />
            Messages
          </h1>
          <p className="text-gray-600 mt-2">
            Communicate with other users about tool rentals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="space-y-3 p-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse flex items-center space-x-3 p-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                      <p className="text-gray-600">
                        Start renting or lending tools to begin conversations
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.other_user?.profile_picture_url} />
                            <AvatarFallback>
                              {conversation.other_user?.full_name?.charAt(0) || 
                               conversation.other_user?.username?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conversation.other_user?.full_name || conversation.other_user?.username}
                              </p>
                              {conversation.unread_count > 0 && (
                                <Badge className="ml-2">{conversation.unread_count}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.tool?.name}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(conversation.last_message_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message View */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <MessageCenter
                bookingId={selectedConversation.booking_id}
                otherUser={selectedConversation.other_user}
                trigger={
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConversation.other_user?.profile_picture_url} />
                          <AvatarFallback>
                            {selectedConversation.other_user?.full_name?.charAt(0) || 
                             selectedConversation.other_user?.username?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {selectedConversation.other_user?.full_name || 
                             selectedConversation.other_user?.username}
                          </h3>
                          <p className="text-sm text-gray-600">
                            About: {selectedConversation.tool?.name}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Click to open conversation</p>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};