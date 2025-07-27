"use client";

import React, { useState } from "react";
import LoginForm from "@/components/forms/LoginForm";
import { login } from "@/lib/api/auth";

const LoginPage = () => {
  const [success, setSuccess] = useState("");

  const handleLogin = async (email: string, password: string) => {
    setSuccess("");
    const result = await login(email, password);
    setSuccess(`Welcome, ${result.user.email}! You are now logged in.`);
    // Here you could store the token in localStorage or context
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <LoginForm onLogin={handleLogin} />
        {success && (
          <div className="mt-4 text-green-600 text-center font-semibold">{success}</div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
