// useSignUp.js
import { useState } from 'react';
import { toast } from 'react-toastify';
// Import your API functions if needed

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const signUp = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call your API endpoint for sign up
      // const response = await authApi.signUp(userData);
      
      // Simulate API call
      await new Promise((resolve, reject) => {
        //   setTimeout(() => reject(new Error('Email already exists')), 2000);
            setTimeout(resolve, 2000);
      });      
      toast.success('Account created successfully!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to create account');
      toast.error(err.message || 'Failed to create account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading, error };
};