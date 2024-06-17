
import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import SignUp from '../../../Auth/SignUp';

const AppliedSignUpPage = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Sign-up</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Authentication</Breadcrumb.Item>
            <Breadcrumb.Item active>sign-up</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <SignUp/>
    </Panel>
  );
};
export default AppliedSignUpPage;
