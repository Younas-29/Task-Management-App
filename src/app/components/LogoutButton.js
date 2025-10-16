import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.replace('/login');
    } catch (err) {
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <button
      className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
