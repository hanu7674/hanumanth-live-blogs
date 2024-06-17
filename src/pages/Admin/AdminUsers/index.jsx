import React, { useEffect } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import  UserList from './users';

const AdminUsersForms = () => {
  return (
    <Panel
      header={
        <>
          <h2 className="title">Admin User Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
            <Breadcrumb.Item >Users</Breadcrumb.Item>
            <Breadcrumb.Item active>Admin User Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
        <UserList/>
      {/* <RouteManagementComponent/> */}
    </Panel>
  );
};

export default AdminUsersForms;
