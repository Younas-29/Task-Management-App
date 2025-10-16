'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskFlowBrandingLogin } from '../components/TaskFlowBrandingLogin';
import { account } from '@/lib/appwrite';

// Animation variants for the content
const contentVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export default function LoginPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const navigateTo = (path) => {
    setIsExiting(true);
    setTimeout(() => {
      router.push(path);
    }, 500); // Match transition duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }
    // Debugging: log form state before attempting login
    console.log('Login form values:', form);
    try {
      // Try to create session, if error is active session, delete and retry
      let session;
      try {
        // 🔥 CHANGE: REMOVE 'const' HERE to assign to the outer 'let session'
        session = await account.createEmailPasswordSession(form.email, form.password);
      } catch (err) {
        if (err?.message?.includes('session is active')) {
          await account.deleteSession('current');
          session = await account.createEmailPasswordSession(form.email, form.password);
        } else {
          throw err;
        }
      }
      navigateTo('/dashboard');
    } catch (err) {
      // Show detailed error message for debugging
      if (err?.message) {
        setError(`Login failed: ${err.message}`);
      } else if (err?.code) {
        setError(`Login failed (code ${err.code})`);
      } else {
        setError('Login failed. Please try again.');
      }
      // Optionally log error to console for developer
      console.error('Login error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50/70">
      {/* Left: Login Form - Parent div is flex to center content */}
      <div className="flex-1 flex items-center justify-center bg-white shadow-xl z-10 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!isExiting && (
            <motion.form
              key="login-form"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              // Ensure the form content itself is centered and spaced
              className="w-full max-w-md space-y-6 px-12 py-16"
              onSubmit={handleSubmit}
            >
              <h2 className="text-3xl font-bold mb-6 text-indigo-600">Sign in to TaskFlow</h2>
              {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold text-lg shadow hover:bg-indigo-700 transition mt-8">
                {loading ? 'Signing In...' : 'Login'}
              </button>
              
              <div className="flex justify-between text-sm mt-2">
                <Link href="#" className="text-indigo-500 hover:underline">Forgot Password?</Link>
                <button type="button" onClick={() => navigateTo('/register')} className="text-gray-500 hover:underline bg-transparent border-none p-0">Need an account? Sign Up</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Branding - Content fades slightly */}
      <motion.div
        key="branding-login-side"
        variants={contentVariants}
        initial={false}
        animate={isExiting ? 'exit' : 'animate'}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative"
      >
        <TaskFlowBrandingLogin />
      </motion.div>
    </div>
  );
}