import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "./auth.jsx";
import api from "../lib/axios";
import { apiEndpoints } from "../lib/endpoints";
import { toast } from "react-toastify";

// useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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
      toast.error(error.message || "Failed to create account");
    },
  });
};

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post(apiEndpoints.login, userData);
      return response;
    },
    onSuccess: (response) => {
      // Assuming the API returns user data and token
      const { user, token } = response.data;
      login(user, token);
      toast.success("Login successful!");
    },
    onError: (error) => {
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
      toast.error(error.message || "Failed to reset password");
    },
  });
};
