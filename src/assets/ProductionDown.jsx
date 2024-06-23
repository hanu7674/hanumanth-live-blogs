import React from 'react';
import { RiErrorWarningLine } from "react-icons/ri";
import UserStatusError from '../components/ErrorPage/UserStatus';

const ProductionDown = () => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <UserStatusError >
<h1 className="error-page-code">
    <RiErrorWarningLine size={64} />
</h1>
      <p className="error-page-title">
        Production is currently down.
      </p>
  <p className="error-page-subtitle text-muted ">
    We are working to resolve the issue. Please check back later.
  </p>
    </UserStatusError>
    
     
  </div>
);

export default ProductionDown;
