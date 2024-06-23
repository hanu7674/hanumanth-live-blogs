import React from 'react';
import { RiBuildingLine } from "react-icons/ri";
import UserStatusError from '../components/ErrorPage/UserStatus';

const UnderConstruction = () => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <UserStatusError >
<h1 className="error-page-code"> <RiBuildingLine size={64} /></h1>
      <p className="error-page-title">Our site is currently under construction. </p>
      <p className="error-page-subtitle text-muted ">Please check back later.</p>
    </UserStatusError>
    
  </div>
);

export default UnderConstruction;