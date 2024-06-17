import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import Error500Component from './Error500';

const Error500 = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Error 500</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Authentication</Breadcrumb.Item>
            <Breadcrumb.Item active>Error 500</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <Error500Component />
    </Panel>
  );
};

export default Error500;
