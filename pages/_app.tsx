import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated by looking for JWT token
    const token = localStorage.getItem('jwt_token');
    if (!token && router.pathname !== '/login') {
      // If no token, redirect to login page
      router.push('/login');
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
