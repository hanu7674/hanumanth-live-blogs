import React, { useEffect } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import  UserList from './users';
import { connect } from 'react-redux';
import {  getApprovedUsers } from '../../../redux/auth';

const ApprovedUsers = ({getApprovedUsers}) => {
  useEffect(()=>{
    getApprovedUsers()
  },[])
  return (
    <Panel
      header={
        <>
          <h2 className="title">Approved User Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
            <Breadcrumb.Item >Users</Breadcrumb.Item>
            <Breadcrumb.Item active>Approved User Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
        <UserList/>
    </Panel>
  );
};
const mapDispatchToProps = dispatch => ({
  getApprovedUsers: () => dispatch(getApprovedUsers())
});
export default connect(null, mapDispatchToProps)(ApprovedUsers);
