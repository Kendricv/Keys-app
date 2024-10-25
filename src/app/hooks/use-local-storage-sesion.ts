import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSessionStore } from '../store/useSessionStore';

export const useLocalStorageSession = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSessionStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (pathname === '/') {
      router.push('/dashboard');
    }
  }, [router]);
};
