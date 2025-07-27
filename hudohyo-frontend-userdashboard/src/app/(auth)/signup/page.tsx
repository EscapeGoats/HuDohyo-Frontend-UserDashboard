"use client";

import React, { useState } from "react";
import SignupForm from "@/components/forms/SignupForm";
import { signup } from "@/lib/api/auth";

const SignupPage = () => {
  const [success, setSuccess] = useState("");

  const handleSignup = async (email: string, password: string) => {
    setSuccess("");
    const result = await signup(email, password);
    setSuccess(`Account created for ${result.user.email}! You can now log in.`);
    // Here you could redirect to login or auto-login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <SignupForm onSignup={handleSignup} />
        {success && (
          <div className="mt-4 text-green-600 text-center font-semibold">{success}</div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
