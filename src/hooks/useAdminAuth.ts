import React, { useState, useEffect } from 'react';

interface UseAdminAuthProps {
  settings: any;
  showAdminToast: (message: string, type?: 'success' | 'danger' | 'info') => void;
}

export const useAdminAuth = ({ settings, showAdminToast }: UseAdminAuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Authenticate Session on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("peno_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (usernameInput === settings.adminUsername && passwordInput === settings.adminPassword) {
      sessionStorage.setItem("peno_admin_auth", "true");
      setIsAuthenticated(true);
      showAdminToast("Selamat datang kembali, Admin!");
    } else {
      setLoginError("Username atau password salah!");
    }
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem("peno_admin_auth");
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
  };

  return {
    isAuthenticated,
    setIsAuthenticated,
    usernameInput,
    setUsernameInput,
    passwordInput,
    setPasswordInput,
    showPassword,
    setShowPassword,
    loginError,
    setLoginError,
    handleLogin,
    handleLogout
  };
};
