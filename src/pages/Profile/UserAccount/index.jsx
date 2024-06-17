
import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import AccountSettings from './accountSettings';
import { useParams } from 'react-router-dom';

const UserAccountSettingsPage = () => {
  const { id } = useParams();

  return (
    <Panel 
      header={
        <>
          <h2 className="title">Account Settings</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>profile</Breadcrumb.Item>
            <Breadcrumb.Item>{id}</Breadcrumb.Item>
            <Breadcrumb.Item active>account-settings</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <AccountSettings/>
    </Panel>
  );
};
export default UserAccountSettingsPage;
