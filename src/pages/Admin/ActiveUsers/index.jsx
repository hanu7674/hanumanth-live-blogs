import React, { useEffect } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import  UserList from './users';
import { useDispatch } from 'react-redux';
import {  getActiveUsers } from '../../../redux/auth';

const ActiveUsers = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getActiveUsers())
  },[])
  return (
    <Panel
      header={
        <>
          <h2 className="title">Active User Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
            <Breadcrumb.Item >Users</Breadcrumb.Item>
            <Breadcrumb.Item active>Active User Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
        <UserList/>
    </Panel>
  );
};

export default ActiveUsers;
