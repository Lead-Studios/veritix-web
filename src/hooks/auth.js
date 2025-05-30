import { useMutation } from "@tanstack/react-query";
import api from "../lib/axios";
import { apiEndpoints } from "../lib/endpoints";
import { toast } from "react-toastify";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post(apiEndpoints.register, userData);
      return response;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(error.message || "Failed to create account");
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
      toast.success("Login successful!");
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(error.message || "Failed to login");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email) => {
      const response = await api.post(apiEndpoints.forgotPassword, { email });
      return response;
    },
    onSuccess: () => {
      toast.success("Password reset link sent to your email!");
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(error.message || "Failed to send password reset link");
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post(apiEndpoints.resetPassword, data);
      return response;
    },
    onSuccess: () => {
      toast.success("Password reset successful!");
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(error.message || "Failed to reset password");
    },
  });
};
