import React, { useEffect } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import  UserList from './users';
import { useDispatch } from 'react-redux';
import {  getRejectedUsers, getRejectedUsersData, getUsersData } from '../../../redux/auth';

const RejectedUsers = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getRejectedUsers())
  },[])
  return (
    <Panel
      header={
        <>
          <h2 className="title">Rejected User Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
            <Breadcrumb.Item >Users</Breadcrumb.Item>
            <Breadcrumb.Item active>Rejected User Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
        <UserList/>
    </Panel>
  );
};

export default RejectedUsers;
