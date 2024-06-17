
import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import SignUpPage from './SignUp';

const SignUpPageAdmin = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Sign-up Template</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Authentication</Breadcrumb.Item>
            <Breadcrumb.Item active>sign-up template</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <SignUpPage />
    </Panel>
  );
};
export default SignUpPageAdmin;
