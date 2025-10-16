'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskFlowBrandingRegister } from '../components/TaskFlowBrandingRegister';
import { account, ID } from '@/lib/appwrite';

// Animation variants for the content
const contentVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function RegisterPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: ''
  });
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

    if (!form.password || !form.confirmPassword) {
      setError('Please fill in both password fields.');
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      // Appwrite will auto-assign userId
      await account.create(ID.unique(), form.email, form.password, form.name);
      // Success: Redirect to login
      navigateTo('/login');
    } catch (err) {
      if (err?.message?.toLowerCase().includes('already exists')) {
        setError('This email is already registered. Try logging in.');
      } else if (err?.message) {
        setError(`Registration failed: ${err.message}`);
      } else if (err?.response?.message) {
        setError(`Registration failed: ${err.response.message}`);
      } else if (err?.response?.errors) {
        setError(`Registration failed: ${JSON.stringify(err.response.errors)}`);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50/70">
      {/* Left: Branding - Content fades slightly */}
      <motion.div
        key="branding-register-side"
        variants={contentVariants}
        initial={false}
        animate={isExiting ? 'exit' : 'animate'}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative"
      >
        <TaskFlowBrandingRegister />
      </motion.div>

      {/* Right: Sign-Up Form - Parent div is flex to center content */}
      <div className="flex-1 flex items-center justify-center bg-white shadow-xl z-10 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!isExiting && (
            <motion.form
              key="register-form"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              // Ensure the form content itself is centered and spaced
              className="w-full max-w-md space-y-6 px-12 py-16" 
              onSubmit={handleSubmit}
            >
              <h2 className="text-3xl font-bold mb-6 text-indigo-600">Create TaskFlow Account</h2>
              {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>


              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold text-lg shadow hover:bg-indigo-700 transition mt-8">
                {loading ? 'Creating Account...' : 'Create TaskFlow Account'}
              </button>
              
              <div className="flex justify-center text-sm mt-2">
                <button type="button" onClick={() => navigateTo('/login')} className="text-gray-500 hover:underline bg-transparent border-none p-0">Already a member? Log In</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}