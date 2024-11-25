import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('jwt_token');
    if (token) {
      router.push('/dashboard');  // Redirect if already logged in
    }
  }, [router]);

  const handleGoogleLogin = () => {
    // Redirect to the Google OAuth provider
    window.location.href = '/api/auth/login?provider=google';
  };

  const handleGithubLogin = () => {
    // Redirect to the GitHub OAuth provider
    window.location.href = '/api/auth/login?provider=github';
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <button onClick={handleGithubLogin}>Login with GitHub</button>
    </div>
  );
};

export default Login;
