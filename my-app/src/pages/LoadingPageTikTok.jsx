import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingPageTikTok = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/tiktok-dash');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a1437]">
      <div className="flex space-x-4">
        <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-orange-300 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-orange-200 rounded-full animate-bounce delay-300"></div>
        <div className="w-4 h-4 bg-orange-100 rounded-full animate-bounce delay-500"></div>
      </div>
    </div>
  );
};

export default LoadingPageTikTok;
