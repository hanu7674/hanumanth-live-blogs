import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import LoginPage from '../../../Auth/Login';

const AppliedSignInPage = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Sign-in</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Authentication</Breadcrumb.Item>
            <Breadcrumb.Item active>sign-in</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <LoginPage/>
    </Panel>
  );
};
export default AppliedSignInPage;
