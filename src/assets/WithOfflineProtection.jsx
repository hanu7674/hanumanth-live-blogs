import React, { useState, useEffect } from 'react';
import { RiWifiOffLine } from "react-icons/ri";
import Loading from '../components/Loading/loading';

const withOfflineProtection = (WrappedComponent) => {
  const WithOfflineProtection = (props) => {
    const [isOnline, setIsOnline] = useState(true); // Assuming online by default
    const [checkingConnection, setCheckingConnection] = useState(true);

    useEffect(() => {
      const checkOnlineStatus = () => {
        setIsOnline(navigator.onLine);
        setCheckingConnection(false);
      };

      const timeoutId = setTimeout(checkOnlineStatus, 3000); // Check connection status after 3 seconds

      window.addEventListener('online', checkOnlineStatus);
      window.addEventListener('offline', checkOnlineStatus);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('online', checkOnlineStatus);
        window.removeEventListener('offline', checkOnlineStatus);
      };
    }, []);

    if (checkingConnection) {
      // Return a loading indicator while checking connection status
      return <div><Loading /></div>;
    }

    return isOnline ? <WrappedComponent {...props} /> : <OfflineMessage />;
  };

  const OfflineMessage = () => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <RiWifiOffLine size={64}/>
      <h3> Oops! You don't have an active internet connection.</h3>
      <h4>Please check your internet connection and try again.</h4>
    </div>
  );

  return WithOfflineProtection;
};

export default withOfflineProtection;
