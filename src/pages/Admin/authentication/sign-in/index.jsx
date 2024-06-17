import SignInPageComponent from './SignIn';
import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';

const SignInPage = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Sign-in Template</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Authentication</Breadcrumb.Item>
            <Breadcrumb.Item active>sign-in template</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <SignInPageComponent />
    </Panel>
  );
};
export default SignInPage;
