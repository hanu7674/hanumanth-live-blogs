import React from 'react';
import { RiToolsLine } from "react-icons/ri";
import UserStatusError from '../components/ErrorPage/UserStatus';

const MaintenanceMode = () => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <UserStatusError>
    <h1 className="error-page-code"><RiToolsLine size={64} /> </h1>
          <p className="error-page-title">We are currently undergoing maintenance. </p>
          <p className="error-page-subtitle text-muted ">Please check back later. Thank you for your patience.</p>
    </UserStatusError>
    
     
  </div>
);

export default MaintenanceMode;
