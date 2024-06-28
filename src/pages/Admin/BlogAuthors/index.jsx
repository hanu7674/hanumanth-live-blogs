import React, { useEffect } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import  UserList from './users';

const BlogsAuthorsUsersForms = () => {
  return (
    <Panel
      header={
        <>
  <h2 className="title">Blog Authors</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Authors</Breadcrumb.Item>
            <Breadcrumb.Item active>Blog Authors</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
        <UserList/>
      {/* <RouteManagementComponent/> */}
    </Panel>
  );
};

export default BlogsAuthorsUsersForms;
