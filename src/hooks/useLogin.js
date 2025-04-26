// useLogin.js
import { useState } from 'react';
import { toast } from 'react-toastify';
// Import your API functions if needed

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call your API endpoint for login
      // const response = await authApi.login(credentials);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Login successful, welcome back!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to login');
      toast.error(err.message || 'Failed to login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
