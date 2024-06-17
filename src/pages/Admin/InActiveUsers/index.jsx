import React, { useEffect } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import  UserList from './users';
import { useDispatch } from 'react-redux';
import {  getInactiveUsers, getUsersData } from '../../../redux/auth';

const InActiveUsers = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getInactiveUsers())
  },[])
  return (
    <Panel
      header={
        <>
          <h2 className="title">InActive User Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
            <Breadcrumb.Item >Users</Breadcrumb.Item>
            <Breadcrumb.Item active>InActive User Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
        <UserList/>
    </Panel>
  );
};

export default InActiveUsers;
