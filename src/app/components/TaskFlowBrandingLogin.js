import React from 'react';

export function TaskFlowBrandingLogin() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <div className="mb-8">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="url(#paint0_linear_1_2)" />
          <text x="50%" y="54%" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" dy=".3em">TF</text>
          <defs>
            <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="0.5" stopColor="#A78BFA" />
              <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">TaskFlow</h1>
      <p className="text-lg font-medium max-w-xs text-center opacity-90 mb-8">Welcome back! Sign in to manage your projects and tasks in real time.</p>
      <div className="flex gap-4 mt-4">
        <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">Secure Access</span>
        <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">Real-time Updates</span>
        <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">Collaboration</span>
      </div>
    </div>
  );
}
