import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolForm } from '../components/ToolForm';
import { useAuth } from '../contexts/AuthContext';

export const AddTool = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSuccess = (tool) => {
    navigate('/dashboard', { 
      state: { message: 'Tool listed successfully!' }
    });
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">List Your Tool</h1>
          <p className="text-gray-600 mt-2">
            Share your tools with the community and earn money
          </p>
        </div>

        <ToolForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};