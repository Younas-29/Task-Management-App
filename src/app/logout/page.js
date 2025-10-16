'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    async function logout() {
      try {
        await account.deleteSession('current');
      } catch (err) {
        // Ignore errors
      }
      router.replace('/login');
    }
    logout();
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-lg text-gray-600">Logging out...</div>
    </div>
  );
}
