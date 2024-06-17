import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import Error404Component from './Error404';

const Error404 = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Error 404</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Authentication</Breadcrumb.Item>
            <Breadcrumb.Item active>Error 404</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <Error404Component />
    </Panel>
  );
};
export default Error404;
