import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { apiEndpoints } from "../lib/endpoints";
import { toast } from "react-toastify";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    const response = await api.post(apiEndpoints.login, credentials);
    if (response.data) {
      setUser(response.data);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

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
      toast.error(error.response?.data?.message || "Failed to create account");
    },
  });
};

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await login(credentials);
      return response;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
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
