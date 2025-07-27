// Mock user update and avatar upload functions

export interface User {
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
}

let mockUser: User = {
  name: "Jane Doe",
  email: "user@example.com",
  avatar: "https://ui-avatars.com/api/?name=Jane+Doe&background=0D8ABC&color=fff",
  createdAt: "2023-01-15",
  lastLogin: "2024-06-01 14:23",
};

export async function updateUserDetails({ name, email }: { name: string; email: string }): Promise<User> {
  await new Promise(res => setTimeout(res, 800));
  mockUser = { ...mockUser, name, email };
  return mockUser;
}

export async function uploadUserAvatar(file: File): Promise<string> {
  await new Promise(res => setTimeout(res, 1000));
  // In a real app, upload to server and get URL. Here, use a local object URL for preview.
  const url = URL.createObjectURL(file);
  mockUser = { ...mockUser, avatar: url };
  return url;
}

export async function getUser(): Promise<User> {
  await new Promise(res => setTimeout(res, 500));
  return mockUser;
}
