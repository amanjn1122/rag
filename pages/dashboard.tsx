import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { useSearchParams } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // const jwt_token = useSearchParams().get('jwt_token')
  // console.log("jwt --->>>",jwt_token);
  // Function to handle sign out
  const handleSignOut = () => {
    // Remove the token from localStorage
    localStorage.removeItem('jwt_token');
    // Redirect to the login page
    router.push('/login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt_token') ;

        if (!token) {
          router.push('/login');  // Redirect to login if token doesn't exist
          return;
        }

        const res = await fetch('/api/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          const data = await res.json();
          if (data.message === 'Token has expired. Please log in again.') {
            // If the token has expired, redirect to login page
            localStorage.removeItem('jwt_token');  // Clear the expired token
            router.push('/login');
            return;
          }
        }

        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
        router.push('/login');  // Redirect to login if there is an error
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {user ? (
        <div>
          <p>Hello, {user.name}</p>
          <img src={user.image} alt="User Avatar" />
        </div>
      ) : (
        <p>No user data available</p>
      )}

      {/* Sign Out Button */}
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Dashboard;
