
import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import PersonalInformation from './personalInformation';
import { useParams } from 'react-router-dom';
const UserPersonalInformationPage = () => {
  const {id} = useParams();
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Personal Information</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>profile</Breadcrumb.Item>
            <Breadcrumb.Item>{id}</Breadcrumb.Item>
            <Breadcrumb.Item active>personal-information</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <PersonalInformation/>
    </Panel>
  );
};
export default UserPersonalInformationPage;
