
import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import ViewTicketsComponent from './ViewTicketsComponent';

const ViewTicketsComponentPage = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">View Tickets</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Tickets</Breadcrumb.Item>
            <Breadcrumb.Item active>View Tickets</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <ViewTicketsComponent/>
    </Panel>
  );
};
export default ViewTicketsComponentPage;
