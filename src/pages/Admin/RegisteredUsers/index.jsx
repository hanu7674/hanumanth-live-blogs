import React, { useEffect } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import  UserList from './users';
import { useDispatch } from 'react-redux';
import { getRegisteredUsers, getRegisteredUsersData, getUsersData } from '../../../redux/auth';

const RegisteredUsers = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getRegisteredUsers())
  },[])
  return (
    <Panel
      header={
        <>
          <h2 className="title">Registered User Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
            <Breadcrumb.Item >Users</Breadcrumb.Item>
            <Breadcrumb.Item active>Registered User Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
        <UserList/>
      {/* <RouteManagementComponent/> */}
    </Panel>
  );
};

export default RegisteredUsers;
