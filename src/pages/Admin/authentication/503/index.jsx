import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import Error503Component from './Error503';

const Error503 = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Error 503</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Authentication</Breadcrumb.Item>
            <Breadcrumb.Item active>Error 503</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <Error503Component />
    </Panel>
  );
};
export default Error503;