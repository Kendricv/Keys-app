import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useLocalStorageSession = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userSession = localStorage.getItem('user-session') || '{}';
    const userSessionJson = JSON.parse(userSession);
    if (!userSessionJson.isLogged) {
      router.push('/login');
    } else if (userSessionJson.isLogged && pathname === '/') {
      router.push('/dashboard');
    }
  }, [router]);
};
