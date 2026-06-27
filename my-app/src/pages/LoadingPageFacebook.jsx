import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/ui/LoadingScreen';

const LoadingPageFacebook = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/facebook-dash');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <LoadingScreen message="Connecting to Facebook..." />;
};

export default LoadingPageFacebook;
