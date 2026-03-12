'use client';

import type { Profile, UserRole } from '@/types';

const USERS_KEY = 'campusrunner_demo_users';
const SESSION_KEY = 'campusrunner_demo_session';

export type DemoUserRecord = Profile & { password: string };

const now = () => new Date().toISOString();
const id = () => Math.random().toString(36).slice(2, 10);

function seedUsers() {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return;
  const admin: DemoUserRecord = {
    id: 'admin-demo-1',
    full_name: 'Campus Admin',
    email: 'admin@campusrunner.app',
    phone: '+2348000000000',
    role: 'admin',
    university: 'CampusRunner University',
    hostel_location: 'Admin Block',
    avatar_url: null,
    created_at: now(),
    password: 'admin123',
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
}

function getUsers(): DemoUserRecord[] {
  if (typeof window === 'undefined') return [];
  seedUsers();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users: DemoUserRecord[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerDemoUser(input: {
  full_name: string;
  email: string;
  phone: string;
  university: string;
  hostel_location: string;
  password: string;
  role: UserRole;
}) {
  const users = getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (exists) throw new Error('An account with that email already exists.');
  const record: DemoUserRecord = {
    id: id(),
    full_name: input.full_name,
    email: input.email,
    phone: input.phone,
    role: input.role,
    university: input.university,
    hostel_location: input.hostel_location,
    avatar_url: null,
    created_at: now(),
    password: input.password,
  };
  users.push(record);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(record));
  return record;
}

export function loginDemoUser(email: string, password: string) {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error('Invalid email or password.');
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function getDemoSession(): DemoUserRecord | null {
  if (typeof window === 'undefined') return null;
  seedUsers();
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

export function logoutDemoUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}
