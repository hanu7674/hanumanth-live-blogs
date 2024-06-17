import React from 'react';
import { Panel, Breadcrumb } from 'rsuite';
import Calendar from './Calender';

const CalenderPage = () => {
  return (
    <Panel
      header={
        <>
          <h2 className="title">Calendar</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/admin/dashboard">Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>Calendar</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <Calendar />
    </Panel>
  );
};

export default CalenderPage;
