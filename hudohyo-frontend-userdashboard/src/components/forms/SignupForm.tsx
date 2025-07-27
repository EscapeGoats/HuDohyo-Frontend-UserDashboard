"use client";

import React, { useState } from "react";

interface SignupFormProps {
  onSignup: (email: string, password: string) => Promise<void>;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Invalid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SignupForm: Form submitted", { email, password });
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      console.log("SignupForm: Calling onSignup");
      await onSignup(email, password);
      console.log("SignupForm: Signup successful");
    } catch (err: unknown) {
      console.error("SignupForm: Signup error", err);
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message?: string }).message || "Signup failed. Please try again.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-50 p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto space-y-5 border border-neutral-200"
    >
      <h2 className="text-xl font-semibold text-neutral-800 text-center mb-2 tracking-tight">Create your account</h2>
      {error && <div className="text-red-500 text-xs text-center mb-2">{error}</div>}
      <div>
        <label className="block mb-1 text-sm text-neutral-700">Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-neutral-900 placeholder-neutral-400 transition"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
          placeholder="example@email.com"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm text-neutral-700">Password</label>
        <input
          type="password"
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-neutral-900 placeholder-neutral-400 transition"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          placeholder="At least 6 characters"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm text-neutral-700">Confirm Password</label>
        <input
          type="password"
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-neutral-900 placeholder-neutral-400 transition"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          placeholder="Repeat your password"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-60 shadow-sm"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm;
