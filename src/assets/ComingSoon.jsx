import React from 'react';
import { RiTimerLine } from "react-icons/ri";
import UserStatusError from '../components/ErrorPage/UserStatus';

const ComingSoon = () => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <UserStatusError >
<h1 className="error-page-code"> <RiTimerLine size={64} /> </h1>
      <p className="error-page-title"> Coming Soon! </p>
      <p className="error-page-subtitle text-muted ">Stay tuned for updates.</p>
    </UserStatusError>
  </div>
);

export default ComingSoon;