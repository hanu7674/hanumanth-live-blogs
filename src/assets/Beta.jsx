import React from 'react';
import { RiTestTubeLine } from "react-icons/ri";
import UserStatusError from '../components/ErrorPage/UserStatus';

const Beta = () => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <UserStatusError >
<h1 className="error-page-code">   <RiTestTubeLine size={64} /></h1>
      <p className="error-page-title"> Welcome to the Beta version. </p>
  <p className="error-page-subtitle text-muted "> We appreciate your feedback.</p>
    </UserStatusError>
  </div>
);

export default Beta;