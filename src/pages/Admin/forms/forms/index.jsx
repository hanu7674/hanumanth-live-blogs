import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import  RouteManagementComponent from './AddRoutesForm';

const FormsPage = () => {
  return (
    <Panel
      header={
        <>
          <h2 className="title">Route Management Forms</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Forms</Breadcrumb.Item>
            <Breadcrumb.Item active>Route Management Forms</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <RouteManagementComponent/>
    </Panel>
  );
};

export default FormsPage;
