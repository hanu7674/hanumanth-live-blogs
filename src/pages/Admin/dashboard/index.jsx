import React from 'react';
import { Panel } from 'rsuite';
import Dashboard from './Dashboard';
const DashBoardPage = () => {
  return (
    <Panel header={<div><h3 className="title">Traffic Dashboard</h3></div>}>
      {/* <PageToolbar /> */}
      <Dashboard />
    </Panel>
  );
};

export default DashBoardPage;
