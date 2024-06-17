
import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import AddTicketsComponent from './AddTicketsComponent';

const AddTicketsComponentPage = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Add Tickets</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Tickets</Breadcrumb.Item>
            <Breadcrumb.Item active>Add a ticket</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <AddTicketsComponent/>
    </Panel>
  );
};
export default AddTicketsComponentPage;
