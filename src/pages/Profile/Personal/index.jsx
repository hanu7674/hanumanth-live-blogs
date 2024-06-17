
import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import PersonalInformation from './personalInformation';
const PersonalInformationPage = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Personal Information</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>profile</Breadcrumb.Item>
            <Breadcrumb.Item active>personal-information</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <PersonalInformation/>
    </Panel>
  );
};
export default PersonalInformationPage;
