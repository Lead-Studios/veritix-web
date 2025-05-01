import { useMutation } from '@tanstack/react-query';
import api from '../lib/axios';
import { apiEndpoints } from '../lib/endpoints';
import { toast } from 'react-toastify';

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post(apiEndpoints.register, userData);
      return response;
    },
    onSuccess: () => {
      toast.success('Account created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create account');
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post(apiEndpoints.login, userData);
      return response;
    },
    onSuccess: () => {
      toast.success('Login successful!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to login');
    },
  });
};
