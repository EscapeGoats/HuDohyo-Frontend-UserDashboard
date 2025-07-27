"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  getUser,
  updateUserDetails,
  uploadUserAvatar,
  User,
} from "@/lib/api/user";
import Image from "next/image";

const defaultAvatar =
  "https://ui-avatars.com/api/?name=User&background=E5E7EB&color=888";

const mockActivity = [
  { id: 1, action: "Logged in", date: "2024-06-01 14:23" },
  { id: 2, action: "Updated profile", date: "2024-05-28 09:10" },
  { id: 3, action: "Changed password", date: "2024-05-20 16:45" },
];

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getUser().then((u) => {
      setUser(u);
      setForm({ name: u.name, email: u.email });
    });
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setAvatarUploading(true);
    try {
      const url = await uploadUserAvatar(e.target.files[0]);
      setUser((prev) => (prev ? { ...prev, avatar: url } : prev));
      setSuccess("Avatar updated!");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    if (user) setForm({ name: user.name, email: user.email });
    setEditMode(false);
    setSuccess("");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      const updated = await updateUserDetails(form);
      setUser(updated);
      setEditMode(false);
      setSuccess("Profile updated!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Profile Card */}
        <div className="flex items-center gap-6 bg-white rounded-2xl shadow p-6 mb-8 border border-neutral-200">
          <div className="relative">
            <Image
              src={user?.avatar || defaultAvatar}
              alt="User avatar"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full border border-neutral-200 shadow-sm object-cover"
            />
            <button
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5 shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              title="Change avatar"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3 21a9 9 0 1 1 18 0H3Z"
                />
              </svg>
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              disabled={avatarUploading}
            />
          </div>
          <div className="flex-1 min-w-0">
            {editMode ? (
              <form onSubmit={handleSave} className="space-y-2">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-neutral-900 placeholder-neutral-400 text-lg font-semibold"
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-neutral-900 placeholder-neutral-400 text-sm"
                  placeholder="Email"
                  required
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="bg-neutral-200 text-neutral-700 px-4 py-1.5 rounded-lg font-medium hover:bg-neutral-300 transition"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-1 truncate">{user?.name || "-"}</h2>
                <p className="text-neutral-500 text-sm truncate">{user?.email || "-"}</p>
                <div className="flex gap-4 mt-2 text-xs text-neutral-400">
                  <span>Joined: {user?.createdAt}</span>
                  <span>Last login: {user?.lastLogin}</span>
                </div>
                <button
                  className="mt-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-100 transition border border-blue-100"
                  onClick={handleEdit}
                >
                  Edit Profile
                </button>
              </>
            )}
            {success && <div className="text-green-600 text-xs mt-2">{success}</div>}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow border border-neutral-100 flex flex-col items-center">
            <span className="text-lg font-bold text-blue-600">3</span>
            <span className="text-xs text-neutral-500 mt-1">Recent Activities</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-neutral-100 flex flex-col items-center">
            <span className="text-lg font-bold text-green-600">Active</span>
            <span className="text-xs text-neutral-500 mt-1">Account Status</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow p-6 border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Recent Activity</h3>
          <ul className="divide-y divide-neutral-100">
            {mockActivity.map((item) => (
              <li key={item.id} className="py-3 flex justify-between text-sm text-neutral-700">
                <span>{item.action}</span>
                <span className="text-neutral-400">{item.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
