import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { 'x-auth-token': token }
        });
        
        setIsAdmin(response.data.role === 'admin');
      } catch (err) {
        console.error('Admin verification failed:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default AdminRoute;
